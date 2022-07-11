const Schedule = require('../model/scheduleModel')
const helperWrapper = require('../helpers/wrapper')

module.exports = {
  addNewSchedule: async (req, res) => {
    try {
      const { movie_id, cinema, location, date, time, price } = req.body
      const setData = { movie_id, cinema, location, date, time, price }
      if (!setData) {
        return helperWrapper.response(
          res, 400, `All field must filled`, null
        )
      }

      const result = await Schedule.addNewSchedule(setData)
      return helperWrapper.response(res, 201, 'Success create new schedule', result)
    } catch (err) {
      return helperWrapper.response(
        res, 400, `Bad request ${err.message}`, null
      )
    }
  },
  getScheduleById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await Schedule.getScheduleById(id)
      if (!result.length) {
        return helperWrapper.response(
          res, 404, `Data by id ${id} not found!`, null)
      }
      return helperWrapper.response(res, 200, "Success show details movie", result)
    } catch (err) {
      return helperWrapper.response(
        res, 400, `Bad request (${err.message})`, null
      )
    }
  },
  getScheduleById: async (req, res) => {
    try {
      const { filter1 = "", filter2 = "", limit = 100 } = req.query
      const result = await Schedule.getScheduleById(filter1, filter2, limit)
      if (!result.length) {
        return helperWrapper.response(
          res, 404, `Data by id ${id} not found!`, null)
      }
      return helperWrapper.response(res, 200, "Success show details movie", result)
    } catch (err) {
      return helperWrapper.response(
        res, 400, `Bad request (${err.message})`, null
      )
    }
  },
  getScheduleNow: async (req, res) => {
    try {
      let { keyword = '', sortBy = '' || 'title', orderBy = '' || 'asc', limit } = req.query
      limit = Number(limit) || 100
      let today = new Date().toISOString().slice(0, 10)
      const result = await Schedule.getScheduleNow(today, keyword, sortBy, orderBy, limit)
      if (!result.length) {
        return helperWrapper.response(
          res, 404, `Schedule movie not found!`, null)
      }
      return helperWrapper.response(res, 200, "Success show details movie", result)
    } catch (err) {
      return helperWrapper.response(
        res, 400, `Bad request (${err.message})`, null
      )
    }
  },
  getScheduleUpComing: async (req, res) => {
    try {
      let { keyword = '', sortBy = '' || 'title', orderBy = '' || 'asc', limit } = req.query
      limit = Number(limit) || 100
      let date = new Date()
      date.setDate(date.getDate() + 1)
      let upComing = date.toISOString().slice(0, 10)
      // console.log(upComing)
      const result = await Schedule.getScheduleUpComing(upComing, keyword, sortBy, orderBy, limit)
      if (!result.length) {
        return helperWrapper.response(
          res, 404, `Schedule movie not found!`, [])
      }
      return helperWrapper.response(res, 200, "Success show details movie", result)
    } catch (err) {
      return helperWrapper.response(
        res, 400, `Bad request (${err.message})`, null
      )
    }
  },

  updateSchedule: async (req, res) => {
    try {
      const { id } = req.params
      const idCheck = await Schedule.getScheduleById(id)
      if (!idCheck.length) {
        return helperWrapper.response(
          res, 404, `Schedule by id ${id} not found!`, null
        )
      }
      const { movie_id, cinema, location, date, time, price } = req.body

      const setData = { ...req.body, updated_at: new Date(Date.now()) }

      const result = await Schedule.updateSchedule(setData, id)
      return helperWrapper.response(res, 200, 'Success update schedule', result)
    } catch (err) {
      return helperWrapper.response(
        res, 400, `Bad request ${err.message}`, null
      )
    }
  },
  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params
      const idCheck = await Schedule.getScheduleById(id)
      if (!idCheck.length) {
        return helperWrapper.response(
          res, 404, `Schedule by id ${id} not found!`, null
        )
      }

      const result = await Schedule.deleteSchedule(id)
      return helperWrapper.response(res, 200, 'Success delete schedule', result)
    } catch (err) {
      return helperWrapper.response(
        res, 400, `Bad request ${err.message}`, null
      )
    }
  },
  getScheduleByMovieId: async (req, res) => {
    try {
      const { movie_id } = req.params
      let { location = '', date = '' } = req.query
      const result = await Schedule.getScheduleByMovieId(movie_id, location, date)
      if (result.length === 0) {
        return helperWrapper.response(
          res, 404, `Data not found`, null
        )
      }
      const newResult = result.map((item) => {
        const data = {
          ...item,
          time: item.time.split(",")
        }
        return data
      })
      return helperWrapper.response(res, 200, "Success show details movie", newResult)

    } catch (err) {
      return helperWrapper.response(
        res, 400, `Bad request (${err.message})`, null
      )
    }
  },

}