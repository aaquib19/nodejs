const crypto = require("crypto");

const User = require("../models/user");
const bcrpyt = require("bcryptjs");

const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");
//youtube
// const xoauth2 = require("xoauth2");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "aaquibniaz3600@gmail.com",
    clientId:
      "433453207997-om6l2c7atmvh4jabk2m4jnk2ccgg7bdt.apps.googleusercontent.com",
    clientSecret: "qdb2VRcOng3tcrKg_1eJX1j1",
    refreshToken: "1/NHRgB3TPVgttkfz4-wmJVVZiJXaOPB71WUM9YF4oJPA",
    accessToken:
      "ya29.Gls8Bwv4UO1QfB2Zm6XSwkE_pySQH4OS2IWi8UbTih00XtNf-6TS9sYfMiMH89_Oh1-YJExYGHaddE2YrD1n8l5vkQ1nv_uxoOqyORNaXaXPl4ozEJEqXFoj9krq"
  }
});

var mailOptions = {
  from: "aaquibniaz3600@gmail.com",
  to: "rehanmallick4080@gmail.com",
  subject: "Nodemailer test",
  text: "Hello World!!"
};

//// youtube end -----------------------------

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//         "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"
//     }
//   })
// );

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash("error", "Invaid email or password");
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invaid email or password",
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrpyt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              mailOptions;
              res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invaid email or password",
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationErrors: []
  });
};

// exports.postSignup = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const confirmPassword = req.body.confirmPassword;
//   User.findOne({ email: email })
//     .then(userDoc => {
//       if (userDoc) {
//         req.flash("error", "email exist");

//         return res.redirect("/signup");
//       }

//       return bcrpyt
//         .hash(password, 12)
//         .then(hashedPassword => {
//           const user = new User({
//             email: email,
//             password: hashedPassword,
//             cart: { items: [] }
//           });
//           return user.save();
//         })
//         .then(result => {
//           res.redirect("/login");
//           console.log("email send");

//           return transporter.sendMail({
//             to: email,
//             from: "shop@node.com",
//             subject: "sign up done",
//             html: "<h1> you are welcome</h1>"
//           });
//         })
//         .catch(err => console.log(err));
//     })
//     .catch(err => console.log(err));
// };

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }
  bcrpyt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
      console.log(email);
      const mailOptions = {
        to: email,
        from: "shop@node-complete.com",
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>"
      };
      return transporter.sendMail(mailOptions, function(err, res) {
        if (err) {
          console.log("Error");
        } else {
          console.log("Email Sent");
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("err");
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        console.log(user.email);
        return user.save();
      })
      .then(result => {
        res.redirect("/");
        const mailOptions = {
          to: "rehanmallick4080@gmail.com",
          from: "shop@node-complete.com",
          subject: "password reset!",
          html: `
          <p>clicl this link to change password</p>
          <a href="http://localhost:3000/reset/${token}">reset</a>
          
          `
        };
        transporter.sendMail(mailOptions, function(err, res) {
          if (err) {
            console.log("Error");
          } else {
            console.log("Email Sent");
          }
        });
      })
      .catch(err => consolelog(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "new Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrpyt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect("/login");
    });
};
