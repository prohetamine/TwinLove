const sceneHandler = ctx => {
  const scenes = []
  
  return {
    add: (type, callback) => scenes.push({ type, callback }),
    exec: async () => {
      console.log(`Exec: ${ctx.user.scene}`)
      for (let x = 0; x < scenes.length; x++) {
        if (ctx.user.scene === scenes[x].type) {
          await scenes[x].callback(ctx)
          return
        }
      }
    }
  }
}

export default sceneHandler