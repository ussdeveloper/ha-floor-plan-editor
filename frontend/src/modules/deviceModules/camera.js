import { CameraIcon } from '@heroicons/react/24/outline'

const camera = {
  type: 'camera',
  name: 'Kamera',
  icon: CameraIcon,
  defaultProps: {
    width: 35,
    height: 35,
    color: '#3b82f6',
    states: {
      recording: { color: '#ef4444', opacity: 1 },
      idle: { color: '#3b82f6', opacity: 0.7 }
    }
  }
}

export default camera
