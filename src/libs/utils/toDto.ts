import { ClassConstructor, plainToInstance } from "class-transformer";

export function toDto<T, V>(dto: ClassConstructor<T>, data: V | V[]) {
    if (Array.isArray(data)) {
        return data.map(item => plainToInstance(dto, item, {
            excludeExtraneousValues: true
        }))
    }
    return plainToInstance(dto, data, {
        excludeExtraneousValues: true
    })
}