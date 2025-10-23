import { PowerIcon } from '@heroicons/react/24/outline'

const sw = {
  type: 'switch',
  name: 'Przełącznik',
  icon: PowerIcon,
  defaultProps: {
    width: 30,
    height: 30,
    color: '#10b981',
    states: {
      on: { color: '#10b981', opacity: 1 },
      off: { color: '#6b7280', opacity: 0.5 }
    }
  }
}

export default sw
