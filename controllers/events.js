import moment from "moment";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getNear = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    if (err) return res.status(401).json("Token Invalid");
    var coords = req.query;
    var radius = req.query.radius;
    if (req.query.category != "" && req.query.category != null) {
      if (Array.isArray(req.query.category)) {
        let q = `SELECT events.* FROM events LEFT JOIN businesses ON (ST_DISTANCE_SPHERE(point(ST_X(coordinates), ST_Y(coordinates)), point(${
          coords.x
        },${
          coords.y
        })) * .000621371192) <= ${radius} where events.businessid = businesses.id AND events.category IN ('${req.query.category.join(
          "','"
        )}')`;
        if (req.query.limit) {
          q = q + " limit 5";
        }
        db.query(q, [req.query.category], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data);
        });
      } else {
        let q = `SELECT events.* FROM events LEFT JOIN businesses ON (ST_DISTANCE_SPHERE(point(ST_X(coordinates), ST_Y(coordinates)), point(${coords.x},${coords.y})) * .000621371192) <= ${radius} where events.businessid = businesses.id AND events.category = '${req.query.category}'`;
        if (req.query.limit) {
          q = q + " limit 5";
        }
        db.query(q, [req.query.category], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data);
        });
      }
    } else {
      let q = `SELECT events.* FROM events 
    LEFT JOIN businesses ON 
    (ST_DISTANCE_SPHERE(point(ST_X(coordinates), ST_Y(coordinates)), point(${coords.x},${coords.y})) * .000621371192) <= ${radius} 
    where events.businessid = businesses.id`;
      if (req.query.limit) {
        q = q + " limit 5";
      }
      db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    }
  });
};

export const getFollowing = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "SELECT * FROM events e INNER JOIN relationships r ON (r.followeduserid = e.businessid) WHERE r.followinguserid = ?";

    db.query(q, [userinfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getPopular = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");
    var coords = req.query;
    var radius = req.query.radius;

    let q = `SELECT events.* FROM events 
    LEFT JOIN businesses ON 
    (ST_DISTANCE_SPHERE(point(ST_X(coordinates), ST_Y(coordinates)), point(${coords.x},${coords.y})) * .000621371192) <= ${radius} 
    where events.businessid = businesses.id ORDER BY events.views DESC LIMIT 5`;
    if (req.query.limit) {
      q = q + " limit 5";
    }
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getPromoted = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");
    var coords = req.query;
    var radius = req.query.radius;

    let q = `SELECT 
	e.* 
FROM 
	events e 
inner join
	promoted p on e.id = p.eventid 
inner join 
	businesses b ON (ST_DISTANCE_SPHERE(point(ST_X(coordinates), ST_Y(coordinates)), point(${coords.x},${coords.y})) * .000621371192) <= 5
where 
	NOW() between p.date AND (p.date + interval p.duration HOUR) AND e.businessid = b.id`;
    if (req.query.limit) {
      q = q + " limit 5";
    }
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const promoteEvent = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");

    let q = `insert into promoted ('1'eventid', 'duration','date') VALUES (${req.query.eventid},${req.query.duration},NOW());`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getNearest = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");
    var coords = req.query;
    let q = `SELECT events.* FROM events 
    LEFT JOIN businesses ON events.businessid = businesses.id ORDER BY ST_DISTANCE_SPHERE(point(ST_X(coordinates), ST_Y(coordinates)), point(${coords.x},${coords.y})) LIMIT 5`;
    if (req.query.limit) {
      q = q + " limit 5";
    }
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getEventsFromBusiness = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    var id = req.params.userid;
    const q = "SELECT * FROM events WHERE businessid = ?";
    db.query(q, [id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getEventsById = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    var id = req.query.eventid;
    if (!id) return;
    const q = "SELECT * FROM events WHERE id = ?";
    db.query(q, [id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const deleteEvent = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    var id = req.query.eventid;
    const q = "DELETE FROM events WHERE id = ?";
    db.query(q, [id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addInteraction = (req, res) => {
  var id = req.query.eventid;
  const q = "UPDATE events SET interactions = interactions + 1 WHERE id = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getProximity = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    const coords = req.query;
    const id = req.query.eventid;
    const q = `SELECT 
	(ST_DISTANCE_SPHERE(point(ST_X(coordinates), ST_Y(coordinates)), point(${coords.x}, ${coords.y})) * .000621371192) AS distance
FROM 
	businesses b
LEFT JOIN 
	events e on e.businessid = b.id
WHERE
    e.id = ${id}`;
    db.query(q, (err, info) => {
      if (err)
        return res.status(500).json({ message: "Failed to get proximity" });
      return res.status(200).json(info);
    });
  });
};

export const updateEvent = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    var id = req.query.id;
    let dateParts = req.body.editDate.split("T");
    let totalHours = req.body.totalHours;
    if (isNaN(totalHours)) {
      return res.status(500).json("Duration is not in the correct format!");
    }
    if (dateParts[1].endsWith(".000Z"))
      dateParts[1] = dateParts[1].slice(0, -5);
    const dateformat = dateParts[0] + " " + dateParts[1];
    const q =
      "UPDATE events SET `title` = ?, `desc` = ?, `date` = ?, `duration` = ? WHERE id = ?";
    db.query(
      q,
      [req.body.editTitle, req.body.editDesc, dateformat, totalHours, id],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      }
    );
  });
};

export const addView = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    var id = req.query.eventid;
    const q = "UPDATE events SET views = views + 1 WHERE id = ?";
    db.query(q, [id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addEvent = (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, process.env.JWT_KEY, async (err, userinfo) => {
    if (err) return res.status(403).json("Token is not valid");
    let dateParts = req.body.date.split("T");
    if (dateParts[1].endsWith(".000Z"))
      dateParts[1] = dateParts[1].slice(0, -5);
    const dateformat = dateParts[0] + " " + dateParts[1];
    const q =
      "INSERT INTO events (`desc`, `category`, `title`,`date`, `duration`, `businessid`, `url`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.category,
      req.body.title,
      dateformat,
      req.body.totalHours,
      userinfo.id,
      req.body.website,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.status(200).json("Post has been created!");
    });
  });
};
