import UserModel from "../models/User.js";
import StateModel from "../models/State.js";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  static userLogin = async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username && password) {
        const user = await UserModel.findOne({ username: username });

        if (user != null) {
          // const isMatch = await bcrypt.compare(password, user.password);
          if (
            user.username === username &&
            user.password === password
            // && isMatch
          ) {
            // Generate JWT Token
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              message: "Login Success",
              token: token,
              user: {
                username: user.username,
                role: user.role,
                state: user.role == "user" ? user.state : "",
              },
            });
          } else {
            res.send({
              status: "failed",
              message: "Email or Password is not Valid",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "You are not a Registered User",
          });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      // console.log(error);
      res.send({ status: "failed", message: "Unable to Login" });
    }
  };

  static addStateCovidData = async (req, res) => {
    try {
      const { state } = req.params;
      const {
        totalcases,
        recovered,
        activecases,
        death,
        vaccinated,
        createdon,
      } = req.body;
      // console.log(state, req.body);
      if (
        !state ||
        !totalcases ||
        !recovered ||
        !activecases ||
        !death ||
        !vaccinated ||
        !createdon
      )
        return res.send({
          status: "failed",
          message: "All Fields are Required",
        });

      const exist = await StateModel.findOne({
        $and: [{ state: state }, { createdon: createdon }],
      });
      if (exist) {
        // console.log("exist date and data");
        return res.send({
          status: "failed",
          message: "Already Exist for the day plz choose edit option",
        });
      }

      const addcoviddata = new StateModel({
        state,
        totalcases,
        recovered,
        activecases,
        death,
        vaccinated,
        createdon,
        isapproved: false,
      });

      // console.log(addcoviddata)

      await addcoviddata.save();

      return res.send({
        status: "success",
        message: "Data added successfully",
      });
    } catch (e) {
      // console.log(e);
      return res.send({ status: "failed", message: e.message });
    }
  };

  static getStateCovidData = async (req, res) => {
    try {
      // console.log("getstate in controller", req);
      const { id } = req.params;

      const data = await StateModel.findById({ _id: id });
      if (data) {
        // console.log('exist state and data',data)
        return res.send({
          status: "success",
          message: "fetched successfully",
          data: data,
        });
      }

      return res.send({ status: "failed", message: "Data not exists" });
    } catch (e) {
      // console.log(e);
      return res.send({ status: "failed", message: e.message });
    }
  };

  static editStateCovidData = async (req, res) => {
    try {
      const { state, id } = req.params;
      const {
        totalcases,
        recovered,
        activecases,
        death,
        vaccinated,
        createdon,
      } = req.body;
      // console.log(state, req.body);
      if (
        !state ||
        !totalcases ||
        !recovered ||
        !activecases ||
        !death ||
        !vaccinated ||
        !createdon
      )
        return res.send({
          status: "failed",
          message: "All Fields are Required",
        });

      const exist = await StateModel.findById({ _id: id });
      if (!exist) {
        // console.log("not exist date and data");
        return res.send({
          status: "failed",
          message: "not Exist for the day plz choose add option",
        });
      }

      await StateModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            state,
            totalcases,
            recovered,
            activecases,
            death,
            vaccinated,
            createdon,
            isapproved: false,
          },
        }
      );

      return res.send({
        status: "success",
        message: "Data eddited successfully",
      });
    } catch (e) {
      // console.log(e);
      return res.send({ status: "failed", message: e.message });
    }
  };

  static deleteStateCovidData = async (req, res) => {
    try {
      const { id } = req.params;

      // console.log(state, req.body);

      await StateModel.findByIdAndDelete({ _id: id });

      return res.send({
        status: "success",
        message: "Data deleted successfully",
      });
    } catch (e) {
      // console.log(e);
      return res.send({ status: "failed", message: e.message });
    }
  };

  static getStateCovidDataForUser = async (req, res) => {
    try {
      const { state } = req.params;

      // console.log(state, req.body);

      const data = await StateModel.find({ state: state });
      // console.log(data)
      if (data)
        return res.send({
          status: "success",
          message: "Data fetched",
          data: data,
        });
      return res.send({
        status: "failed",
        message: "error while fetching details of covid",
      });
    } catch (e) {
      // console.log(e);
      return res.send({ status: "failed", message: e.message });
    }
  };

  static getStateCovidDataForPublic = async (req, res) => {
    try {
      // console.log("req in controller", req.body);

      const { searchState } = req.body;
      const { sort } = req.body;

      let sorting = 1;
      if (sort === "desc") sorting = -1;

      if (searchState?.label == null || searchState.label === "ALL") {
        
        const data = await StateModel.aggregate([
          { $match: { isapproved: true } },
          { $sort: { state: sorting } },
          {
            $group: {
              _id: { State: "$state" },
              Total: { $sum: "$totalcases" },
              Recovered: { $sum: "$recovered" },
              Active: { $sum: "$activecases" },
              Death: { $sum: "$death" },
              Vaccinated: { $sum: "$vaccinated" },
              LastUpdated: { $max: "$dateapproved" },
            },
          },
        ]);

        if (data)
          return res.send({
            status: "success",
            message: "Data fetched",
            data: data,
          });
        return res.send({
          status: "failed",
          message: "error while fetching details of covid",
        });
      } else {
        const data = await StateModel.aggregate([
          { $match: { isapproved: true, state: searchState.label } },
          { $sort: { state: sorting } },

          {
            $group: {
              _id: { State: "$state" },
              Total: { $sum: "$totalcases" },
              Recovered: { $sum: "$recovered" },
              Active: { $sum: "$activecases" },
              Death: { $sum: "$death" },
              Vaccinated: { $sum: "$vaccinated" },
              LastUpdated: { $max: "$dateapproved" },
            },
          },
        ]);

        if (data)
          return res.send({
            status: "success",
            message: "Data fetched",
            data: data,
          });
        return res.send({
          status: "failed",
          message: "error while fetching details of covid",
        });
      }
    } catch (e) {
      // console.log(e);
      return res.send({ status: "failed", message: e.message });
    }
  };

  static getStateCovidDataForAdmin = async (req, res) => {
    try {
      // console.log(state, req.body);
      const currentDate = new Date();
      const IsoCurDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0
      );

      const data = await StateModel.find({ createdon: IsoCurDate });
      // console.log(data)
      if (data)
        return res.send({
          status: "success",
          message: "Data fetched",
          data: data,
        });
      return res.send({
        status: "failed",
        message: "error while fetching details of covid",
      });
    } catch (e) {
      // console.log(e);
      return res.send({ status: "failed", message: e.message });
    }
  };

  static approveStateCovidData = async (req, res) => {
    try {
      const { id } = req.params;
      const currentDate = new Date();
      const IsoCurDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0
      );

      const data = await StateModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            dateapproved: IsoCurDate,
            isapproved: true,
          },
        }
      );

      // console.log(data)
      if (data)
        return res.send({
          status: "success",
          message: "approved successfully",
        });
      return res.send({
        status: "failed",
        message: "error while fetching details of covid",
      });
    } catch (e) {
      // console.log(e);
      return res.send({ status: "failed", message: e.message });
    }
  };
}

export default UserController;
