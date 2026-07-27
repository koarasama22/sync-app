import { WebSocketServer } from "ws"

const wss = new WebSocketServer({ port: 3000 })

const clients = new Map()

wss.on("connection", (ws) => {

    ws.on("message", (message) => {
        const data = JSON.parse(message)

        if (data.type === "register") {
            clients.set(data.id, ws)
            ws.id = data.id
        }

        if (data.type === "pair") {
            const target = clients.get(data.target)

            if (target) {
                ws.targetId = data.target
                target.targetId = ws.id

                ws.send(JSON.stringify({
                    type: "pair-success",
                    from: data.target
                }))

                target.send(JSON.stringify({
                    type: "pair-notify",
                    from: ws.id
                }))

                target.send(JSON.stringify({
                    type: "paired-confirm"
                }))

                ws.send(JSON.stringify({
                    type: "paired-confirm"
                }))
            }
        }

        if (data.type === "file") {
            const target = clients.get(data.to)

            if (target) {
                target.send(JSON.stringify({
                    type: "file",
                    name: data.name,
                    data: data.data
                }))
            }
        }
    })

    ws.on("close", () => {
        clients.delete(ws.id)
    })
})
