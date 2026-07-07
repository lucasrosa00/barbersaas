import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'

interface HeaderActionsDispatch {
  setActions: (actions: ReactNode) => void
  clearActions: () => void
}

const HeaderActionsStateContext = createContext<ReactNode>(null)
const HeaderActionsDispatchContext =
  createContext<HeaderActionsDispatch | null>(null)

function isAgendaPath(pathname: string): boolean {
  return pathname === '/agenda' || pathname.endsWith('/agenda')
}

export function HeaderActionsProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [actions, setActionsState] = useState<ReactNode>(null)

  const setActions = useCallback((nextActions: ReactNode) => {
    setActionsState(nextActions)
  }, [])

  const clearActions = useCallback(() => {
    setActionsState(null)
  }, [])

  const dispatch = useMemo(
    () => ({
      setActions,
      clearActions,
    }),
    [setActions, clearActions],
  )

  useLayoutEffect(() => {
    if (!isAgendaPath(pathname)) {
      clearActions()
    }
  }, [pathname, clearActions])

  return (
    <HeaderActionsDispatchContext.Provider value={dispatch}>
      <HeaderActionsStateContext.Provider value={actions}>
        {children}
      </HeaderActionsStateContext.Provider>
    </HeaderActionsDispatchContext.Provider>
  )
}

export function useHeaderActionsState() {
  return useContext(HeaderActionsStateContext)
}

export function useHeaderActionsDispatch() {
  const context = useContext(HeaderActionsDispatchContext)
  if (!context) {
    throw new Error(
      'useHeaderActionsDispatch must be used within HeaderActionsProvider',
    )
  }
  return context
}
