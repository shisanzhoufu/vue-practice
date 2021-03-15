//Dep用来收集依赖/收集订阅者
class Dep{
    constructor(){
        //一个空数组用来存放数据
         this.sub = []
    }

    //定义一个方法用来给sub中添加数据
    addSub(watcher){
        this.sub.push(watcher)
    }


    //发布通知的方法
    notify(){
        this.sub.forEach((watcher)=>watcher.update())
    }
}

//订阅者的类
class Watcher{
    constructor(cb){
        this.cb = cb
    }
    //更新数据
    update(){
        this.cb()
    }
}

//创建两个订阅者
const w1 = new Watcher(()=>{
    console.log('watcher1')
})
const w2 = new Watcher(()=>{
    console.log('watcher2')
})

// 创建一个Dep实例
const dep = new Dep()


/**
 * 当我们重新给vue中的data赋值了，这个赋值的过程被检测到，并通知给订阅者
 * 接下来，订阅者（DOM元素）要根据数据的变化重新渲染界面
 */

//把w1  w2 添加到sub数组中
dep.addSub(w1)
dep.addSub(w2)

//调用notify发布通知
dep.notify()