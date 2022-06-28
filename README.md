### 依赖
1. react 版本 > 17
2. react-router-dom v6版本可用

### 使用方法

1. `useGuardedRoutes`创建

```tsx
import { Navigate } from 'react-router-dom'
import Layout from '../pages/Layout'
import { lazy, Suspense } from 'react'
import GuardedRoute, { useGuardedRoutes, IGuardedRoute } from './GuardedRoute'

export enum RoutePath {
  A = '/a',
  B = '/b',
  C = '/c'
}

const lazyElement = (routePath: string) => {
  const Component = lazy(() => import(routePath))
  return (
    <Suspense fallback={<div> 加载中... </div>}>
      <Component />
    </Suspense>
  )
}

export const routes: IGuardedRoute[] = [
  {
    path: '/',
    element: <Navigate to={RoutePath.A} replace={true} />,
    isGuarded: false
  },
  {
    element: <Layout />,
    isGuarded: false,
    children: [
      {
        path: RoutePath.A,
        element: lazyElement('../pages/A'),
        guard: () => true,
        isGuarded: true
      },
      {
        path: RoutePath.B,
        element: lazyElement('../pages/B'),
        guard: () => true,
        isGuarded: true
      },
      {
        path: RoutePath.C,
        element: lazyElement('../pages/C'),
        guard: () => false,
        redirect: '/b',
        isGuarded: true
      }
    ]
  },
  {
    path: '*',
    element: lazyElement('../pages/Error'),
    isGuarded: false
  }
]

export default function Routes() {
  return useGuardedRoutes(routes)
}
```

2. `GuardedRoute`创建

```tsx
import { Navigate, useRoutes } from 'react-router-dom'
import Layout from '../pages/Layout'
import { lazy, Suspense } from 'react'
import GuardedRoute, { useGuardedRoutes, IGuardedRoute } from './GuardedRoute'

export enum RoutePath {
  A = '/a',
  B = '/b',
  C = '/c'
}

const lazyElement = (routePath: string, ...rest) => {
  const Component = lazy(() => import(routePath))
  return (
    <GuardedRoute 
    guard={rest.guard} 
    redirect={rest.redirect} 
    replace={rest.replace} 
    state={rest.replace}>
      <Suspense fallback={<div> 加载中... </div>}>
        <Component />
      </Suspense>
    </GuardedRoute>
  )
}

export const routes: IGuardedRoute[] = [
  {
    path: '/',
    element: <Navigate to={RoutePath.A} replace={true} />
  },
  {
    element: <Layout />,
    children: [
      {
        path: RoutePath.A,
        element: lazyElement('../pages/A')
      },
      {
        path: RoutePath.B,
        element: lazyElement('../pages/B')
      },
      {
        path: RoutePath.C,
        element: lazyElement('../pages/C')
      }
    ]
  },
  {
    path: '*',
    element: lazyElement('../pages/Error'),
  }
]

export default function Routes() {
  return useRoutes(routes)
}
```

### 具体参数

| GuardedRoute         |         描述       |
| ------------ | --------------------------------------- |
| `guard?: () => boolean`     | 路由守卫，返回boolean值以确定是否渲染 |
| `redirect?: string`        | 提供重定向地址，默认`/` |
| `replace?: boolean` | 开启replace，默认`false`      |
| `state?: Record<string, any>`    | 重定向跳转携带参数，会添加`from: '跳转而来的路由地址'`  |
| `isGuarded?: boolean` | 是否开启守卫，只有在使用`useGuardedRoutes`创建时有用  |


