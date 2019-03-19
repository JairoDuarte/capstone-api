import axios from 'axios';

const address = process.env.ROUTE_SERVICE || 'http://localhost:4001';

export const getRoutesFromLocal = async (routes) =>{

    const response = await axios.post(`${address}/findroute`,{points: routes});
    console.log(response.data);
    return response.data;
}

export  const getOptimezedRoutes = async (routes,rabioCoordinate) => {
    return  getRoutesFromHere (routes, rabioCoordinate) 
} 
export  const getRoutesFromHere = async (routes,rabioCoordinate) => {
    let key = `app_id=${process.env.HERE_API_ID}&app_code=${process.env.HERE_API_CODE}`;
    let paramRoutes = `start=${rabioCoordinate[0]},${rabioCoordinate[1]}&`;
    let index=1;
    routes.map(item => {
        paramRoutes+=`destination${index}=${item.lat},${item.lng}&`
        index++;
    })
    let query = `${paramRoutes}&mode=fastest;car&${key}`; 
    // TODO : paramettrer le mode (car, moto ....)
    const response = await axios.get(`https://wse.api.here.com/2/findsequence.json?${query}`);
    console.log(response.data);
    return response.data.results;
    
} 