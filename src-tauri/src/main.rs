// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn read_iso_serial(iso_path: &str) -> Result<String, ()> {
    use iso9660::{DirectoryEntry, ISO9660};
    use std::fs::File;
    use std::io::Read;

    let file = File::open(iso_path).unwrap();
    let fs = ISO9660::new(file).unwrap();

    match fs.open("SYSTEM.CNF").unwrap() {
        Some(DirectoryEntry::File(file)) => {
            let mut raw = Vec::new();
            file.read().read_to_end(&mut raw).unwrap();

            let config = String::from_utf8(raw).unwrap();

            let serial = config.split("\\").collect::<Vec<_>>()[1]
                .split(";")
                .collect::<Vec<_>>()[0]
                .replace(".", "")
                .replace("_", "-");

            Ok(serial)
        }
        _ => Err(()),
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
struct Game {
    serial: String,
    path: String,
    name: Option<String>,
}

#[tauri::command]
fn read_directory_games(path: &str) -> Result<Vec<Game>, ()> {
    // Get all files that end with .iso in the directory
    let mut iso_files = std::fs::read_dir(path)
        .unwrap()
        .filter_map(|entry| {
            let entry = entry.unwrap();
            let path = entry.path();
            if path.is_file() && path.extension().unwrap() == "iso" {
                Some(path.to_str().unwrap().to_string())
            } else {
                None
            }
        })
        .collect::<Vec<_>>();

    let mut games = Vec::new();

    // Read the serial from the iso
    for file in iso_files.iter_mut() {
        let serial = read_iso_serial(file).unwrap();

        games.push(Game {
            serial,
            path: file.to_string(),
            name: None,
        });
    }

    Ok(games)
}

#[tauri::command]
fn launch_game(pcsx2_path: &str, iso_path: &str) {
    use std::process::{Command, Stdio};

    let mut process = Command::new(pcsx2_path);

    process
        .arg(iso_path)
        .arg("--fullscreen")
        .arg("--nogui")
        .arg("--portable")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_directory_games,
            read_iso_serial,
            launch_game
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
