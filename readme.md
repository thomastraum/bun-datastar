You're right to question this, as there are some important distinctions to make regarding HTTP and streaming:

1. Traditional HTTP/1.0 didn't support persistent connections or streaming by default. Each request/response pair required a new TCP connection.

2. HTTP/1.1 introduced keep-alive connections, allowing multiple request/response pairs over a single TCP connection. However, this still follows a request-response pattern rather than true streaming.

3. HTTP/2 and HTTP/3 support true multiplexing and streaming of data.

4. Server-Sent Events (SSE) is a technology built on top of HTTP that allows servers to push data to clients in real-time over a single HTTP connection.

In the context of the code provided in Bun's documentation, there are a few key points:

1. Bun.serve() is using modern web standards and likely supports HTTP/2 or at least HTTP/1.1 with keep-alive.

2. The Response object in modern web APIs (which Bun implements) supports streaming bodies. This allows the server to start sending data before the entire response is ready.

3. The specific example using ReadableStream and async generators is demonstrating how to create a streaming response body:

```javascript
return new Response(
  async function* () {
    yield "Hello, ";
    yield Buffer.from("world!");
  }(),
  {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  }
);
```

This creates a response that can stream data to the client over a single HTTP connection. The client doesn't need to reconnect for each piece of data.

4. The headers being set ('Content-Type': 'text/event-stream', 'Connection': 'keep-alive') indicate this is likely using Server-Sent Events (SSE) or a similar streaming technique.

So while traditional HTTP doesn't inherently support streaming, modern web technologies and HTTP versions do allow for efficient streaming of data from server to client without requiring multiple connections or requests. Bun is leveraging these capabilities to provide a simple API for creating streaming responses.