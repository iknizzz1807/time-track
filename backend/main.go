package main

import (
	"database/sql"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/mattn/go-sqlite3"
)

type Activity struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
    Time int    `json:"time"`
}

func main() {
    // Initialize database
    db, err := sql.Open("sqlite3", "./activities.db")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Create table if not exists
    _, err = db.Exec(`CREATE TABLE IF NOT EXISTS activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        time INTEGER
    )`)

    if err != nil {
        log.Fatal(err)
    }

    _, err = db.Exec(`CREATE TABLE IF NOT EXISTS tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_id INTEGER,
        time INTEGER,
        date TEXT,
        FOREIGN KEY (activity_id) REFERENCES activity(id) ON DELETE CASCADE
    )`)

    if err != nil {
        log.Fatal(err)
    }

    // Initialize Fiber app
    app := fiber.New()

	// Use CORS middleware
    app.Use(cors.New(cors.Config{
        AllowOrigins: "*", // Allow all origins
        AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
    }))

    // GET endpoint to retrieve all activities
    app.Get("/activities", func(c *fiber.Ctx) error {
        rows, err := db.Query("SELECT id, name, time FROM activity")
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }
        defer rows.Close()

        var activities []Activity
        for rows.Next() {
            var activity Activity
            if err := rows.Scan(&activity.ID, &activity.Name, &activity.Time); err != nil {
                return c.Status(500).SendString(err.Error())
            }
            activities = append(activities, activity)
        }

        return c.JSON(activities)
    })

    // POST endpoint to create a new activity
    app.Post("/activities", func(c *fiber.Ctx) error {
        var activity Activity
        if err := c.BodyParser(&activity); err != nil {
            return c.Status(400).SendString(err.Error())
        }

        result, err := db.Exec("INSERT INTO activity (name, time) VALUES (?, ?)", activity.Name, activity.Time)
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }

        id, err := result.LastInsertId()
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }

        activity.ID = int(id)

        return c.Status(201).JSON(activity)
    })

    app.Patch("/activities/:id", func(c *fiber.Ctx) error {
        id := c.Params("id")
    
        var input struct {
            Time int `json:"time"`
        }
        if err := c.BodyParser(&input); err != nil {
            return c.Status(400).SendString(err.Error())
        }
    
        var currentTime int
        err := db.QueryRow("SELECT time FROM activity WHERE id = ?", id).Scan(&currentTime)
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }
    
        newTime := currentTime + input.Time
    
        _, err = db.Exec("UPDATE activity SET time = ? WHERE id = ?", newTime, id)
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }

        // Insert a new track record
        _, err = db.Exec("INSERT INTO tracks (activity_id, time, date) VALUES (?, ?, ?)", id, input.Time, time.Now())
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }
    
        return c.SendStatus(200)
    })

    app.Delete("/activities/:id", func(c *fiber.Ctx) error {
        id := c.Params("id")
    
        result, err := db.Exec("DELETE FROM activity WHERE id = ?", id)
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }
    
        rowsAffected, err := result.RowsAffected()
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }
    
        if rowsAffected == 0 {
            return c.Status(404).SendString("Activity not found")
        }
    
        return c.SendStatus(200)
    })

    app.Get("/tracks", func(c *fiber.Ctx) error {
        rows, err := db.Query(`
            SELECT tracks.id, tracks.activity_id, tracks.time, tracks.date, activity.name
            FROM tracks
            JOIN activity ON tracks.activity_id = activity.id
        `)
        if err != nil {
            return c.Status(500).SendString(err.Error())
        }
        defer rows.Close()
    
        var tracks []struct {
            ID         int    `json:"id"`
            ActivityID int    `json:"activity_id"`
            Time       int    `json:"time"`
            Date       string `json:"date"`
            Name       string `json:"name"`
        }
    
        for rows.Next() {
            var track struct {
                ID         int    `json:"id"`
                ActivityID int    `json:"activity_id"`
                Time       int    `json:"time"`
                Date       string `json:"date"`
                Name       string `json:"name"`
            }
            if err := rows.Scan(&track.ID, &track.ActivityID, &track.Time, &track.Date, &track.Name); err != nil {
                return c.Status(500).SendString(err.Error())
            }
            tracks = append(tracks, track)
        }
    
        if err := rows.Err(); err != nil {
            return c.Status(500).SendString(err.Error())
        }
    
        return c.JSON(tracks)
    })

    // Start Fiber app
    log.Fatal(app.Listen(":8080"))
}