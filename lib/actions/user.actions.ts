import { connectToDB } from "@/database/mongoose"

export const getAllUsersForNewsEmail = async () => {

    try {
        const mongoose = await connectToDB();
        const db = mongoose.connection.db;

        if (!db) throw new Error('数据库连接失败')

        // 实际上是 await cursor.toArray() 将游标转换为数组
        // cursor代表查询结果集，但数据是懒加载的
        // toArray() 一次加载所有数据，消耗大量内存
        // 其他方法（迭代）: forEach(), next(), 适合大数据集
        const users = await db.collection('user').find(
            { email: { $exists: true, $ne: null } },
            { projection: { _id: 1, id: 1, name: 1, email: 1, country: 1 } }
        ).toArray();

        return users.filter((user) => user.email && user.name).map((user) => ({
            id: user.id || user._id?.toString() || '',
            email: user.email,
            name: user.name,
        }))
    } catch (error) {
        console.error('Error fetching users list', error)
        return []
    }
}

