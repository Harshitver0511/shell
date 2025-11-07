import * as React from "react"

const Slider = React.forwardRef(({ 
  className = "", 
  min = 0, 
  max = 100, 
  step = 1, 
  value = [50],
  onValueChange,
  ...props 
}, ref) => {
  const [sliderValue, setSliderValue] = React.useState(value[0] || min)
  
  React.useEffect(() => {
    if (value && value[0] !== undefined) {
      setSliderValue(value[0])
    }
  }, [value])
  
  const handleChange = (e) => {
    const newValue = Number(e.target.value)
    setSliderValue(newValue)
    if (onValueChange) {
      onValueChange([newValue])
    }
  }
  
  return (
    <div className={`relative flex w-full touch-none select-none items-center ${className}`}>
      <input
        type="range"
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((sliderValue - min) / (max - min)) * 100}%, #e5e7eb ${((sliderValue - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
        {...props}
      />
      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }