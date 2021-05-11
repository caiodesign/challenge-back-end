import { IProperty } from '../../properties/properties.interfaces'

import { VIVA_REAL, ZAP } from './common.validators.contants'

export class PropertiesValidators {
  protected minlon = -46.693419
  protected minlat = -23.568704
  protected maxlat = -23.546686
  protected maxlon = -46.641146

  protected checkAddress({ address }: IProperty): boolean {
    const { geolocation } = address

    if (geolocation?.location?.lon && geolocation?.location?.lat) return true

    return false
  }

  protected checkUsableAreas({ usableAreas }: IProperty): boolean {
    if (usableAreas) return true

    return false
  }

  protected checkPropertyInsideBoudingBox(props: IProperty): boolean {
    if (!this.checkAddress(props)) return false

    const lon = props.address.geolocation.location.lon
    const lat = props.address.geolocation.location.lat

    const isInside = {
      lon: lon > this.minlon && lon < this.maxlon,
      lat: lat > this.minlat && lat < this.maxlat
    }

    return isInside.lon && isInside.lat
  }

  protected checkVivarealProperty(property: IProperty): boolean {
    const isInsideBoudingBox = this.checkPropertyInsideBoudingBox(property)

    if (property.pricingInfos.businessType === 'RENTAL') {
      const maxRentalPrice = isInsideBoudingBox
        ? VIVA_REAL.RENTAL_PRICE_INSIDE_BOUNDING_BOX
        : VIVA_REAL.RENTAL_PRICE

      const condoFee = {
        value: Number(property.pricingInfos?.monthlyCondoFee),
        isValid: true
      }

      if (condoFee.value || condoFee.value === 0) {
        condoFee.isValid = Boolean(
          condoFee.value <
            Number(property.pricingInfos.price) * VIVA_REAL.MAX_CONDO_FEE
        )
      }

      return (
        Number(property.pricingInfos.rentalTotalPrice) >= maxRentalPrice &&
        condoFee.isValid
      )
    }

    if (property.pricingInfos.businessType === 'SALE') {
      return Number(property.pricingInfos.price) >= VIVA_REAL.SALE_PRICE
    }

    return false
  }

  protected checkZapProperty(property: IProperty): boolean {
    const isInsideBoudingBox = this.checkPropertyInsideBoudingBox(property)

    if (property.pricingInfos.businessType === 'RENTAL') {
      return Number(property.pricingInfos.rentalTotalPrice) <= ZAP.RENTAL_PRICE
    }

    if (property.pricingInfos.businessType === 'SALE') {
      const minUsableAreaValue =
        Number(property.pricingInfos.price) / property.usableAreas >=
        ZAP.MIN_USABLE_AREA_PRICE

      const minSalePrice = isInsideBoudingBox
        ? ZAP.SALE_PRICE - ZAP.SALE_PRICE * ZAP.INSIDE_BOUDING_BOX
        : ZAP.SALE_PRICE

      return (
        Number(property.pricingInfos.price) <= minSalePrice &&
        minUsableAreaValue
      )
    }

    return false
  }

  public checkPropertyIsEligibleFor(
    portal: string,
    property: IProperty
  ): boolean {
    const hasUsableAreas = this.checkUsableAreas(property)
    if (!hasUsableAreas) return false

    switch (portal) {
      case VIVA_REAL.id:
        return this.checkVivarealProperty(property)
      case ZAP.id:
        return this.checkZapProperty(property)
      default:
        return false
    }
  }
}

export default new PropertiesValidators()
