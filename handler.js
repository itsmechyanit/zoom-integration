const base64 = require("base-64");
exports.generateToken = async (req, res, next) => {
  try {
    const response = await fetch(
      `${process.env.TOKEN_URL}?grant_type=account_credentials&account_id=${process.env.ACCOUNT_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${base64.encode(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          )}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("There was a problem generating the token");
    }
    const data = await response.json();
    req.access_token = data.access_token;
    next();
    // res.status(200).json({
    //   status: "success",
    //   data: {
    //     data,
    //   },
    // });
  } catch (err) {
    res.status(500).render("error");
  }
};

exports.generateMeeting = async (req, res, next) => {
  console.log(req.access_token);
  console.log(req.body);
  const { topic, time, date, duration, password } = req.body;
  //yyyy-MM-ddTHH:mm:ss
  const start_time = `${date}T${time}`;
  console.log(start_time);
  try {
    const response = await fetch(`${process.env.MEETING_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${req.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        start_time,
        duration: +duration,
        timezone: "Asia/Calcutta",
        password,
        type: 2,
        settings: {
          join_before_host: true,
          waiting_room: false,
        },
        meeting_authentication: true,
      }),
    });
    console.log(response.ok);
    if (!response.ok) {
      throw new Error(
        "There is a problem in creating a meeting, Please try again"
      );
    }

    const data = await response.json();
    const localDateTime = new Date(data.start_time).toLocaleString("en-IN", {
      timeZone: "Asia/Calcutta",
    });
    res.status(201).render("meeting_info.ejs", {
      join_url: data.join_url,
      password: data.password,
      purpose: data.topic,
      duration: data.duration,
      startTime: localDateTime,
    });
    // res.status(201).json({
    //   status: "success",
    //   data: {
    //     join_url: data.join_url,
    //     password: data.password,
    //     purpose: data.topic,
    //     duration: data.duration,
    //     startTime: data.start_time,
    //   },
    // });
  } catch (err) {
    res.status(500).render("error");
  }
};
