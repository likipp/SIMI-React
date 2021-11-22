import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { message, notification } from 'antd';
import type { RequestConfig } from '@@/plugin-request/request';
import 'moment/dist/locale/zh-cn'
import 'moment/locale/zh-cn'
import moment from 'moment';

moment.locale('zh-ch')

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath && history.location.pathname !== "/") {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// 验证Header传递的token
const authHeaderInterceptor = (url: string, options: any) => {
  const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

const ResponseInterceptors = async (response: Response) => {
  const data = await response.clone().json()
  if (data.errorCode != 200 && data.status != "ok") {
    console.log(data, "错误了", data.showType)
    if (data.showType == 1) {
      message.error({
        content: data.errorMessage,
        className: 'custom-message-color'
      })
    } else {
      console.log(234234234)
      notification.error({
        description: data.errorMessage,
        message: data.errorCode,
      });
    }
  }
  return response;
};

export const request: RequestConfig = {
  errorHandler: (error: any) => {
    const { response } = error;
    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
    throw error;
  },
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [ResponseInterceptors]
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    locale: {
      enable: true,
      default: 'zh-CN',
      baseNavigator: true
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
