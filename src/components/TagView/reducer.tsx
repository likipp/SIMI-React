const tagReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'init':
      const initTag = {title: action.title, path: action.path,
        children: action.children, refresh: action.refresh, active: action.active}
      return [initTag]
    case 'add':
      console.log(state, "状态")
      const newTag = {title: action.title, path: action.path,
        children: action.children, refresh: action.refresh, active: action.active}
      return [...state, newTag]
    case 'closeOther':
      return [{title: action.title, path: action.path,
        children: action.children, refresh: action.refresh, active: action.active}]
    case 'closeSelf':
      return [...state]
    case 'closeAll':
      return [{title: action.title, path: action.path,
        children: action.children, refresh: action.refresh, active: action.active}]
    default:
      throw new Error()
  }
}

export default tagReducer
