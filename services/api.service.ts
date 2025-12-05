import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: '',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config)
    return response.data
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  // Si data est FormData, supprimer le header 'Content-Type' pour laisser Axios gérer
  if (data instanceof FormData) {
    config = { ...config, headers: { ...config?.headers, 'Content-Type': undefined } }
  }
  const response: AxiosResponse<T> = await this.api.post(url, data, config)
  return response.data
}

async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  if (data instanceof FormData) {
    config = { ...config, headers: { ...config?.headers, 'Content-Type': undefined } }
  }
  const response: AxiosResponse<T> = await this.api.put(url, data, config)
  return response.data
}


  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config)
    return response.data
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, config)
    return response.data
  }
}

export default new ApiService()
