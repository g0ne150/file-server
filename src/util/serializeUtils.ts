type ProperityKey = string | symbol
type JSONFieldParamter = { name?: ProperityKey; ignore?: boolean }

class JSONSerializeMetadata {
    constructor(
        public properityKey: ProperityKey,
        public jsonKey: ProperityKey | null = null,
        public ignore: boolean = false
    ) {}
}

const JSON_KEY_MAP_LIST_METADATA_KEY = Symbol("json-name-list-key")

// 实现 JSONData、JSONField 控制 json 序列化过程
export const JSONField = function (
    params: JSONFieldParamter = {}
): PropertyDecorator {
    return (target: any, propertyKey: ProperityKey) => {
        const { name, ignore } = params
        const metadataList: JSONSerializeMetadata[] =
            Reflect.getMetadata(JSON_KEY_MAP_LIST_METADATA_KEY, target) || []
        metadataList.push(
            new JSONSerializeMetadata(propertyKey, name || propertyKey, ignore)
        )

        Reflect.defineMetadata(
            JSON_KEY_MAP_LIST_METADATA_KEY,
            metadataList,
            target
        )
    }
}

export const JSONData = function () {
    return function classDecorator<T extends { new (...args: any[]): {} }>(
        constructor: T
    ) {
        return class extends constructor {
            toJSON() {
                const copyOfThis: any = { ...this }
                const metadataList: JSONSerializeMetadata[] =
                    Reflect.getMetadata(JSON_KEY_MAP_LIST_METADATA_KEY, this) ||
                    []
                metadataList.forEach((m) => {
                    if (m.ignore === true) {
                        delete copyOfThis[m.properityKey]
                        return
                    }
                    if (m.jsonKey) {
                        copyOfThis[m.jsonKey] = (this as any)[m.properityKey]
                    }
                    if (m.jsonKey !== m.properityKey) {
                        delete copyOfThis[m.properityKey]
                    }
                })
                return copyOfThis
            }
        }
    }
}
