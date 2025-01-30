import * as React from "react"
import { type ToastProps } from "./toast"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 1000

type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

interface State {
  toasts: ToasterToast[]
}

const initialState: State = { toasts: [] }

export function reducer(state: State, action: any): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case 'DISMISS_TOAST': {
      const { toastId } = action

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }
    }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }

  return state
}

export function useToast() {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const toast = React.useCallback(
    ({ ...props }: ToastProps) => {
      const id = props.id || Math.random().toString(36).substr(2, 9)

      const update = state.toasts.find((t) => t.id === id)
      if (update) {
        dispatch({
          type: 'UPDATE_TOAST',
          toast: { ...update, ...props },
        })
      } else {
        dispatch({
          type: 'ADD_TOAST',
          toast: {
            ...props,
            id,
            title: props.title,
            description: props.description,
            action: props.action,
          },
        })
      }

      return id
    },
    [state.toasts]
  )

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({ type: 'DISMISS_TOAST', toastId })
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', toastId: undefined })
    }, TOAST_REMOVE_DELAY)

    return () => {
      clearTimeout(timer)
    }
  }, [state.toasts])

  return {
    ...state,
    toast,
    dismiss,
  }
}

export function toast(props: ToastProps) {
  const { toast } = useToast()
  return toast(props)
}
