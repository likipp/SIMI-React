export interface UserInfo {
  username: string;
  nickname: string;
  deptID: string;
  remark?: string;
  sex?: string;
  status?: number;
  roles?: any[];
}

export interface UserStatus {
  status: number;
  uuid: string;
}

export interface LoginParamsType {
  username: string;
  password: string;
  Type: string
}
