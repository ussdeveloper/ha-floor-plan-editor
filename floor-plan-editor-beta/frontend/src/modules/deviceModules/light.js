import { LightBulbIcon } from '@heroicons/react/24/outline'

const light = {
  type: 'light',
  name: 'Światło',
  icon: LightBulbIcon,
  defaultProps: {
    width: 40,
    height: 40,
    color: '#fbbf24',
    states: {
      on: { color: '#fbbf24', opacity: 1 },
      off: { color: '#6b7280', opacity: 0.5 }
    }
  }
}

export default light
