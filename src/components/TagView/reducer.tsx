import { history } from '@@/core/history';
import { TagsItemType } from '@/components/TagView/index';

const tagReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'init':
      const initTag = {title: action.title, path: action.path,
        children: action.children, refresh: action.refresh, active: action.active}
      return [initTag]
    case 'add':
      console.log("来添加了")
      state.map((item: any) => {
        item.active = false
      })
      const newTag = {title: action.title, path: action.path,
        children: action.children, refresh: action.refresh, active: action.active}
      return [...state, newTag]
    case 'closeOther':
      return [{title: action.title, path: action.path,
        children: action.children, refresh: action.refresh, active: action.active}]
    case 'closeSelf':
      const state2 = state.filter((el) => el.path !== action.tag.path)
      console.log("点击了删除")
      // state.forEach((el, i) => {
      //   if (el.path === action.tag.path && action.tag.active) {
      //     const next = state[i - 1];
      //     next.active = true;
      //     history.push({ pathname: next?.path, query: next?.query });
      //   }
      // });
      // if (action.currentMenu) {
      //   state2.map((item: any) => {
      //     if (item.path !== action.currentMenu.path) {
      //       return { ...item, active: false };
      //     } else {
      //       return { ...item, active: true, children: action.children };
      //     }
      //   })
      // }
      console.log(state2, "状态copy")
      return [{...state2}]
    case 'closeAll':
      return [{title: action.title, path: action.path,
        children: action.children, refresh: action.refresh, active: action.active}]
    case 'change':
      const tagsCopy: TagsItemType[] = state.map((el: any) => ({ ...el }));
      if (action.currentMenu) {
        tagsCopy.map((item: any) => {
          if (item.path !== action.currentMenu.path) {
            return { ...item, active: false };
          } else {
            return { ...item, active: true, children: action.children };
          }
        })
      }
      return [{...state}]
    default:
      throw new Error()
  }
}

export default tagReducer
