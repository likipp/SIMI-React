
const selectReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'custom':

      return
    case 'product':
      action.form.setFieldsValue({[action.rowKey]: {unit_price: action.item.price}})
      action. form.setFieldsValue({[action.rowKey]: {p_name: action.item.p_name}})
      action.form.setFieldsValue({[action.rowKey]: {ware_house: action.item.ware_house.toString()}})
      return
  }
}

export default selectReducer
