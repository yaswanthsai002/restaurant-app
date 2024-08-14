import {useState, useEffect} from 'react'

import Header from '../Header'
import DishItem from '../DishItem'

import './index.css'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [apiResponse, setAPIResponse] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState('')

  const [cart, setCart] = useState([])

  const addItemToCart = dish => {
    const isAlreadyExists = cart.find(item => item.dishId === dish.dishId)
    if (!isAlreadyExists) {
      const newDish = {...dish, quantity: 1}
      setCart(prev => [...prev, newDish])
    } else {
      setCart(prev =>
        prev.map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: item.quantity + 1}
            : item,
        ),
      )
    }
  }

  const removeItemFromCart = dish => {
    const isAlreadyExists = cart.find(item => item.dishId === dish.dishId)
    if (isAlreadyExists) {
      setCart(prev =>
        prev
          .map(item =>
            item.dishId === dish.dishId
              ? {...item, quantity: item.quantity - 1}
              : item,
          )
          .filter(item => item.quantity > 0),
      )
    }
  }

  const getUpdatedData = tableMenuList =>
    tableMenuList.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      menuCategoryImage: eachMenu.menu_category_image,
      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat,
      })),
    }))

  const fetchRestaurantApi = async () => {
    const api =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
    const response = await fetch(api)
    const data = await response.json()
    const updatedData = getUpdatedData(data[0].table_menu_list)
    setAPIResponse(updatedData)
    setActiveCategoryId(updatedData[0].menuCategoryId)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchRestaurantApi()
  }, [])

  const onUpdateActiveCategoryIdx = menuCategoryId =>
    setActiveCategoryId(menuCategoryId)

  const renderTabMenuList = () =>
    apiResponse.map(eachCategory => {
      const onClickHandler = () =>
        onUpdateActiveCategoryIdx(eachCategory.menuCategoryId)

      return (
        <li
          className={`each-tab-item ${
            eachCategory.menuCategoryId === activeCategoryId
              ? 'active-tab-item'
              : ''
          }`}
          key={eachCategory.menuCategoryId}
          onClick={onClickHandler}
        >
          <button type="button" className="category-button">
            {eachCategory.menuCategory}
          </button>
        </li>
      )
    })

  const renderDishes = () => {
    const {categoryDishes} = apiResponse.find(
      eachCategory => eachCategory.menuCategoryId === activeCategoryId,
    )

    return (
      <ul className="m-0 d-flex flex-column dishes-list-container">
        {categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            cart={cart}
            addItemToCart={addItemToCart}
            removeItemFromCart={removeItemFromCart}
          />
        ))}
      </ul>
    )
  }

  const renderSpinner = () => (
    <div className="spinner-container">
      <div className="spinner-border" role="status" />
    </div>
  )

  return isLoading ? (
    renderSpinner()
  ) : (
    <div className="home-background">
      <Header cart={cart} />
      <ul className="category-container">{renderTabMenuList()}</ul>
      {renderDishes()}
    </div>
  )
}

export default Home
