import axios from 'axios'

// 查询 PV/UV 数据
export function getPV() {
    console.log("jinru");
    // 密钥
    const access_token = '121.86a4023c5ea3000fbf4c9ee07cf6b8e5.YGIt0Q1NbNK69zKm0cMvGVGL-GLk13P7lFLFIwT.AVCmHg'
    // 网站id
    const site_id = "22749072"
    const method = "visit/toppage/a"
    const start_date = "20251215"
    const end_date = "20251231"
    const metrics = "pv_count"


    // 正确的获取数据的 API 地址是 openapi.baidu.com/.../getData
    const url = '/baidu-api/rest/2.0/tongji/report/getData'
    const params = {
        access_token: access_token,
        site_id: site_id,
        start_date: start_date,
        end_date: end_date,
        metrics: metrics,
        method: method
    }
    return axios.get(url, {
        params: params
    })
}