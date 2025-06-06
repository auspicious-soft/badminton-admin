import { axiosInstance, getAxiosInstance } from "@/config/axios";

export const loginService = async (payload: any) => await axiosInstance.post(`/login`, { email: payload.email, password: payload.password });
export const forgotPasswordService = async (payload: any) => await axiosInstance.post(`/forgot-password`, payload)
export const sendOtpService = async (payload: any) => await axiosInstance.post(`/verify-otp-reset-pass`, payload)
export const resetUserPassword = async (payload: any) => await axiosInstance.patch(`/new-password-otp-verified`, payload)


//----------Profile Page--------------------------
export const getAdminDetails = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const updateAdminDetails = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.put(route, payload)
}
//----------merchandises Page--------------------------
export const createMerchandise = async (route: string,payload:any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const getAllMerchandise = async (route: string,payload:any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const getMerchandise = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}

export const updateMerchandise = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.patch(route, payload)
}

//----------Orders Page--------------------------
export const updateOrder = async (payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.put('/admin/orders', payload)
}

export const getOrderReceipt = async (orderId: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(`/order-receipt/${orderId}`)
}
//----------Inventory Page--------------------------

export const createInventory = async (route: string,payload:any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const updateInventory = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.put(route, payload)
}

export const deleteInventory = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.delete(route)
}
//----------Maintenance Page--------------------------

export const createMaintenance = async (route: string,payload:any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const updateMaintenance = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.put(route, payload)
}
export const getVenueForMaintenance = async (route: string) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.get(route)
}
export const getCourtForMaintenance = async (route: string) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.get(route)
}
export const getMaintenance = async (route: string) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.get(route)
}

export const deleteMaintenance = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.delete(route)
}
//----------Employee Page--------------------------
export const getAllUser = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const getUserDetails = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const updateUser = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.put(route, payload)
}
//----------Matches Page--------------------------
export const getAllMatches = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const getAllCities = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
// export const getUserDetails = async (route: string) => {
//     const axiosInstance = await getAxiosInstance()
//     return axiosInstance.get(route)
// }
// export const updateUser = async (route: string, payload: any) => {
//     const axiosInstance= await getAxiosInstance()
//     return axiosInstance.put(route, payload)
// }
//----------Users Page--------------------------
export const createEmployee = async (route: string,payload:any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const getAllEmployees = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const getEmployeeById = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const updateEmployee = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.put(route, payload)
}
//----------Venue Page--------------------------
export const createVenue = async (route: string,payload:any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const getAllVenues = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const getVenue = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const updateVenue = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.put(route, payload)
}
export const updateCourt = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
//----------User Page--------------------------
export const getAllUsers = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const getSingleUsers = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const addNewUser = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const updateSingleUser = async (route: string, payload: any) => {
    const axiosInstance= await getAxiosInstance()
    return axiosInstance.put(route, payload)
}
export const getSingleUserOrders = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}

//----------Dynamic Pricing--------------------------
export const saveDynamicPricing = async (payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post('/admin/dynamic-pricing', payload)
}
export const getDynamicPricing = async () => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get('/admin/dynamic-pricing')
}
// Legacy functions for backward compatibility
export const addDynamicPricing = async (payload: any) => {
    return saveDynamicPricing(payload)
}
export const updateDynamicPricing = async (id: string, payload: any) => {
    const payloadWithId = { ...payload, id }
    return saveDynamicPricing(payloadWithId)
}

//--------------Notifications page  ---------------
export const postNotificationToAll = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const postNotificationToSpecific = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}

//--------------Book Events and Blogs ---------------
export const addBookEventFormData = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const addBlogFormData = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}

//--------------Admin Settings ---------------
export const updateAdminSettings = async (payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post('/admin/admin-settings', payload)
}
export const getAdminSettings = async () => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get('/admin/admin-settings')
}
//--------------Terms&Conditions Settings ---------------
export const postTermsSettings = async (route:string ,payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const getTermsSettings = async (route: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route)
}
//--------------Dashboard Settings ---------------

export const getDashboard = async (route: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}

//--------------Reward Settings ---------------
export const updateLoyaltyPoints = async (payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.put('/admin/reward-settings/loyaltyPoints', payload)
}
export const getLoyaltyPoints = async () => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get('/admin/reward-settings/loyaltyPoints')
}

export const updateReferralSettings = async (payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.put('/admin/reward-settings/referral', payload)
}
export const getReferralSettings = async () => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get('/admin/reward-settings/referral')
}


