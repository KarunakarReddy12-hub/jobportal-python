import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'

const categories = [
  'Frontend Developer',
  'Backend Developer',
  'Data Science',
  'Graphic Designer',
  'FullStack Developer',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
]

const CategoryCarousel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchByCategory = (cat) => {
    dispatch(setSearchedQuery(cat))
    navigate('/browse')
  }

  return (
    <div className="my-10 px-4">
      <h2 className="text-center text-2xl font-bold mb-6">Browse by Category</h2>
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {categories.map((cat, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
              <Button
                variant="outline"
                className="w-full rounded-full hover:bg-[#6A38C2] hover:text-white transition-colors"
                onClick={() => searchByCategory(cat)}
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default CategoryCarousel
