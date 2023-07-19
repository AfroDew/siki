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

/*===============================Module=============================*/ 
const Job = component /*html*/`
    <div class="event">
        <h3>${job.title}</h3>
        <div>${job.description}</div>
    </div>
`;
export default module({
    path: "/jobs",

    // async handle(request, props render) {
    //     return await render("index", { logs:[] })
    // },

    routes: {
        "$index": page({layout: "root->website", handle: getJobs, title: "") /*html*/`
            <section>
                ${(props) => props.logs.reduce((acc, log) => acc + `
                <div class="event">
                    <h3>${log.title}</h3>
                    <div>${log.time}</div>
                </div>
                `, "")}
            </section>
        `;


        "[id]": render({handle:getJob}) /*html*/` ${Job} `;

        "json-data": raw({ handle: getJobsJson });
    }
})

async function getJobsJson(request, props, render){
    return render({job: [
        { id:"0x1", title: "Design Engineer", description: "This is a dope job." },
        { id:"0x2", title: "Engineering Physicist", description: "This is a dope job." },
    ]})
}

async function getJobs(request, props, render){
    const jobs = getJobsJson();
    return render({renderedJobs: jobs.reduce((acc, job) => acc + Job({...props, job}), "")})
}

async function getJob(request, props, render){
    console.log({id: props.$params.id})
    return render({job: { 
        id:"0x1", 
        title: "Design Engineer", 
        description: "This is a dope job." 
    }})
}
```
