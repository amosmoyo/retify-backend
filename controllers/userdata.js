const USERS = require('../models/users');

const dataFiltered = (reqObjData, ...munipulatedData) => {
  const dataObject = {};
  // if (munipulatedData.includes(reqObjData)) {
  //Object.keys (returns an array with key names as elements)
  Object.keys(reqObjData).forEach((el) => {
    if (munipulatedData.includes(el)) {
      dataObject[el] = reqObjData[el];
    }
  });
  // }
  console.log(dataObject);
  // console.log(munipulatedData);
  return dataObject;
};

exports.getAllUser = async (req, res, next) => {
  const users = await USERS.find();
  try {
    res.status(200).json({
      status: 'success',
      users
    });

    next();
  } catch (error) {
    res.status(404).json({
      status: 'success',
      message: error
    });
  }
};

exports.getOneUser = async (req, res, next) => {
  const user = await USERS.findById(req.userdata._id);
  try {
    res.status(200).json({
      status: 'success',
      user
    });

    next();
  } catch (error) {
    res.status(404).json({
      status: 'success',
      message: error
    });
  }
};

// update personal details
exports.updatemydata = async (req, res, next) => {
  // console.log(dataFiltered(req.body, 'user', 'admin'));

  if (req.body.password || req.body.passwordCornfirm) {
    return res.status(200).json({
      status: 'fail',
      message: 'The data for this records can not be editted here (password and password confirmation'
    });
  }

  const updateData = dataFiltered(req.body, 'name', 'email');

  console.log(updateData);

  const updatedUser = await USERS.findByIdAndUpdate(req.userdata._id, updateData, { new: true, runValidators: true });
  res.status(200).json({
    status: 'success',
    updatedUser
  });
  next();
};

// delete my account
exports.deleteMyAccount = async (req, res, next) => {
  await USERS.findByIdAndUpdate(req.userdata._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });

  next();
};
