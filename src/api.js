export const myax = axios.create({
    baseURL: "https://seriescope-api.vercel.app/api",
    timeout: 8000,
    headers: { "X-Learner": "i.chaoub" }
});
