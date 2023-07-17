# Siki

```ts
page({
    path: "/logs", 
    async handle(request, props render) {
        // Get search query
        const logs any[] = [];

        return await render({ logs })
    }
}) /*html*/`
    <section>
        ${(props) => props.logs.reduce((acc, log) => acc + `
        <div class="event">
            <h3>${log.title}</h3>
            <div>${log.time}</div>
        </div>
        `, "")}
    </section>
`;
```
