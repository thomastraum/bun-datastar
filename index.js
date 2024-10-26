import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { randomBytes } from 'crypto'
import { ReadableStream } from 'stream/web'

const app = new Hono()
const backendData = {}

function setHeaders(c) {
  c.header('Cache-Control', 'no-cache');
  c.header('Content-Type', 'text/event-stream');
  c.header('Connection', 'keep-alive');
}

function sendSSE({ c, frag, selector, mergeType, end }) {
  c.write("event: datastar-fragment\n");
  if (selector) c.write(`data: selector ${selector}\n`);
  if (mergeType?.length) c.write(`data: merge ${mergeType}\n`);
  c.write(`data: fragment ${frag}\n\n`);
  if (end) c.end();
}

app.put("/put", async (c) => {
  const { input } = await c.req.json();
  backendData.input = input;
  const output = `Your input: ${input}, is ${input.length} long.`;
  
  return new Response(
    async function* () {
      yield "event: datastar-fragment\n";
      yield `data: selector #output\n`;
      yield `data: fragment <div id="output">${output}</div>\n\n`;
    }(),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    }
  );
});

function indexPage() {
  return `
    <!doctype html><html>
      <head>
        <title>Bun/Hono + Datastar Example</title>
        <script type="module" defer src="https://cdn.jsdelivr.net/npm/@sudodevnull/datastar"></script>
      </head> 
      <body>
        <h2>Bun/Hono + Datastar Example</h2>
        <main class="container" id="main" data-store='{ input: "", show: false };'>
            <input type="text" placeholder="Type here!" data-model="input" />
            <div id="output"></div>
            <button data-on-click="$$put('/put')">Send State</button>
            <button data-on-click="$show=!$show">Toggle</button>
            <div data-show="$show">
              <span>Hello From Datastar!</span>
            </div>
        </main>
      </body>
    </html>`
}

app.get('/', (c) => c.html(indexPage()))



const port = parseInt(process.env.PORT || '3000', 10)

console.log(`Server is running on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch
}
