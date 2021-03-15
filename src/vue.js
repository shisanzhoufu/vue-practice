class Vue{
    constructor(options){
        this.$data = options.data

        //调用Observe方法给data里的数据都添加getter，setter方法
        Observe(this.$data)
    }
}

function Observe(obj){
    //判断obj是否为对象，如果时对象要递归执行
    if(!obj||typeof obj !== 'object') return

    //通过Object.keys获取到obj上的每个节点['name','age','info']
    Object.keys(obj).forEach(key=>{
        let value = obj[key]
        Observe(value)
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                console.log('有人获取了值')
                return value
            },
            set(newValue){
                return value = newValue
            }
        })
    })
}