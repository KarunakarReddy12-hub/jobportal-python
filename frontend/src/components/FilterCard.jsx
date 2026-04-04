import React, { useEffect, useState } from 'react'
import { RadioGroup } from './ui/radio-group'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
  { label: 'Location', values: ['Delhi', 'Bangalore', 'Hyderabad', 'Mumbai', 'Chennai', 'Remote'] },
  { label: 'Industry', values: ['Frontend Developer', 'Backend Developer', 'FullStack Developer', 'Data Science', 'DevOps', 'Designer'] },
  { label: 'Salary', values: ['0-3 LPA', '3-6 LPA', '6-10 LPA', '10+ LPA'] },
]

const FilterCard = () => {
  const [selected, setSelected] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSearchedQuery(selected))
  }, [selected, dispatch])

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border">
      <h2 className="font-bold text-lg mb-4">Filter Jobs</h2>
      <hr className="mb-4" />
      {filterData.map((filter) => (
        <div key={filter.label} className="mb-5">
          <h3 className="font-semibold text-sm mb-2 text-gray-700">{filter.label}</h3>
          <RadioGroup value={selected} onValueChange={setSelected}>
            {filter.values.map((val) => (
              <div key={val} className="flex items-center space-x-2 mb-1">
                <Input
                  type="radio"
                  name="filter"
                  value={val}
                  checked={selected === val}
                  onChange={() => setSelected(val)}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label className="text-sm cursor-pointer">{val}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
      {selected && (
        <button
          onClick={() => setSelected('')}
          className="text-xs text-[#6A38C2] hover:underline mt-2"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

export default FilterCard
