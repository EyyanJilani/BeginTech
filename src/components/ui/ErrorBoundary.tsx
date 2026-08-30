import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = { children: ReactNode; fallback: ReactNode; label?: string }
type State = { failed: boolean }

/**
 * Contains rendering failures to a single region. Used around the WebGL
 * surfaces so a driver crash degrades to the CSS visual instead of a blank page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.warn(`[${this.props.label ?? 'ErrorBoundary'}]`, error, info.componentStack)
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
