import {
  Navigate,
  RouteObject,
  useLocation,
  useRoutes,
} from 'react-router-dom';

export interface IGuardedRouteProp {
  // 组件属性
  children?: JSX.Element;
  guard?: () => boolean; // 守卫函数
  redirect?: string; // 重定向路径
  replace?: boolean; // 是否启用replace
  state?: Record<string, any>; // 携带信息
}

export interface IGuardedRoute
  extends RouteObject,
    Omit<IGuardedRouteProp, 'children'> {
  // 当使用 useGuardedRoutes 时所需参数
  isGuarded?: boolean; // 是否启用保护
  children?: IGuardedRoute[];
}

// 供导出自定义使用
export default function GuardedRoute(props: IGuardedRouteProp) {
  const {
    children = null,
    guard = undefined,
    redirect = '/',
    replace = false,
    state = {},
  } = props;
  const location = useLocation();
  return guard && guard() ? (
    <>{children}</>
  ) : (
    <Navigate
      to={redirect}
      replace={replace}
      state={{ from: `${location.pathname}${location.search}`, ...state }}
    />
  );
}

// 供函数式生成使用
export function useGuardedRoutes(guardedRoutes: IGuardedRoute[]) {
  const transformGuardedRoutes = (guardedRoutes: IGuardedRoute[]) => {
    return guardedRoutes.map(route => {
      if (route.children) {
        route.children = transformGuardedRoutes(route.children);
      }
      const {
        guard,
        redirect,
        replace,
        state,
        element,
        isGuarded = false,
        ...rest
      } = route;
      return isGuarded
        ? {
            element: (
              <GuardedRoute
                guard={guard}
                redirect={redirect}
                replace={replace}
                state={state}
              >
                <>{element}</>
              </GuardedRoute>
            ),
            ...rest,
          }
        : {
            element,
            ...rest,
          };
    });
  };

  const routes: RouteObject[] = transformGuardedRoutes(guardedRoutes);
  return useRoutes(routes);
}
