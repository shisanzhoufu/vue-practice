

const obj = {
    name:'jack',
    age:20,
    info:{
        a:10
    }
}

Object.defineProperty(obj,'name',{
    enumerable:true,//是否允许被循环
    configurable:true,
    get(){
        return '有人获取了name值'
    },
    set(newVal){
        console.log('设置了新name',newVal)
    }
})
console.log(obj.name)
obj.name = 'rose'
