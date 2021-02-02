const Serializable = function <T extends { new (...args: any[]): {} }>(
    constructor: T
) {
    return class extends constructor {
        toJSON() {

        }
    }
}


// TODO serialize json 输出 get 内容

// TODO 实现 JSONField 控制 json 序列化过程