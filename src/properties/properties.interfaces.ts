export interface address {
  geolocation: {
    location: {
      lon: number
      lat: number
    }
  }
}

export interface princingInfos {
  yearlyIptu: string
  price: string
  businessType: string
  monthlyCondoFee?: string
  rentalTotalPrice?: string
  period?: string
}

export interface Pagination {
  data: IProperty[] | []
  pagination: {
    total: number
    current_page: number
    limit: number
  }
}
export interface IProperty {
  usableAreas: number
  listingType: string
  createdAt: string
  listingStatus: string
  id: string
  parkingSpaces: number
  updatedAt: string
  owner: boolean
  images: string[]
  address: address
  bathrooms: number
  bedrooms: number
  pricingInfos: princingInfos
}
