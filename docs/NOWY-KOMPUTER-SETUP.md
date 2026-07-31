# Poradnik Konfiguracji Środowiska (Stary PC: Intel/GTX 1060 & Przyszły Nowy PC: AMD/Wasserkühlung 360)

Witaj! Ten kompletny przewodnik został przygotowany specjalnie pod kątem Twoich dwóch komputerów:
1. **Twojego obecnego (starego) komputera, który właśnie uruchomiłaś:**
   - **Model:** MSI Infinite A (płyta główna MSI B360M Bazooka)
   - **Procesor:** Intel Core i7-8700 CPU @ 3.20GHz (6 rdzeni, 12 wątków)
   - **Pamięć RAM:** 8,00 GB
   - **Karta graficzna:** NVIDIA GeForce GTX 1060 6GB
   - **Dysk:** 2 TB HDD (ST2000DM006)
   - **System operacyjny:** Windows 10 Home/Pro 64-bit

2. **Twojego przyszłego (nowego) komputera, który dopiero kupisz:**
   - **Baza/Obudowa:** MSI Infinite
   - **Płyta główna:** MSI Bazooka (wersja pod procesory AMD Ryzen zamiast Intel)
   - **Procesor:** AMD Ryzen
   - **Karta graficzna:** Nowa karta NVIDIA GPU
   - **Chłodzenie:** Wasserkühlung 360 (chłodzenie wodne z chłodnicą 360mm)
   - **System operacyjny:** Windows 10/11 z WSL2

W tym poradniku znajdziesz instrukcje dopasowane zarówno do pracy na obecnym komputerze z procesorem **Intel i 8 GB RAM**, jak i do późniejszego wdrożenia na nowym superkomputerze z procesorem **AMD i chłodzeniem wodnym 360**.

---

## Spis treści
1. [KROK 1: Konfiguracja BIOS i POST (Dla obu komputerów)](#krok-1-konfiguracja-bios-i-post-dla-obu-komputerów)
2. [KROK 2: Instalacja WSL2 i Optymalizacja dla 8 GB RAM & HDD (Obecny PC)](#krok-2-instalacja-wsl2-i-optymalizacja-dla-8-gb-ram--hdd-obecny-pc)
3. [KROK 3: Akceleracja GPU Nvidia GTX 1060 / Nowej Karty w WSL2](#krok-3-akceleracja-gpu-nvidia-gtx-1060--nowej-karty-w-wsl2)
4. [KROK 4: Instalacja Narzędzi Deweloperskich (Git, Terraform, AWS, Helm)](#krok-4-instalacja-narzędzi-deweloperskich)
5. [KROK 5: Uruchomienie Projektu ClusterLaunch](#krok-5-uruchomienie-projektu-clusterlaunch)
6. [KROK 6: Monitoring Parametrów Sprzętowych w Grafanie](#krok-6-monitoring-parametrów-sprzętowych-w-grafanie)

---

## KROK 1: Konfiguracja BIOS i POST (Dla obu komputerów)

Płyty główne MSI Bazooka posiadają system **EZ Debug LED** (diody: CPU, DRAM, VGA, BOOT) obok głównego złącza zasilania. Jeśli komputer przechodzi POST pomyślnie, wszystkie te diody gasną zaraz po włączeniu.

Wejdź do BIOS-u, naciskając klawisz **Delete** (lub **F2**) podczas uruchamiania komputera, a następnie przejdź do trybu zaawansowanego (**F7**).

### A. Włączenie Wirtualizacji w BIOS (Niezbędne do działania WSL2!)
Musisz włączyć wirtualizację w procesorze, aby Windows 10 mógł uruchomić podsystem Linux (WSL2):

*   **Dla obecnego komputera (Intel i7-8700 + MSI B360M Bazooka):**
    1. Przejdź do zakładki **OC** (Overclocking) -> **CPU Features**.
    2. Znajdź opcję **Intel Virtualization Tech** (lub **Intel VT-x**) i ustaw ją na **Enabled**.
    3. Znajdź opcję **Intel VT-D Tech** i również ustaw ją na **Enabled**.
    4. Zapisz klawiszem **F10** i zrestartuj komputer.

*   **Dla przyszłego komputera (AMD Ryzen + MSI Bazooka AMD):**
    1. Przejdź do zakładki **OC** -> **CPU Features** (lub **Advanced CPU Configuration**).
    2. Znajdź opcję **SVM Mode** (Secure Virtual Machine) i ustaw ją na **Enabled**.
    3. Zapisz klawiszem **F10** i zrestartuj komputer.

### B. Konfiguracja Chłodzenia Wodnego 360 (Dla przyszłego PC)
W menu **Hardware Monitor**:
1. Podłącz pompę pod `PUMP_FAN1` i ustaw sterowanie **DC** na sztywno na **12V (100% obrotów)**. Pompa wodna AIO musi działać na pełnych obrotach, aby zapewnić ruch cieczy.
2. Podłącz wentylatory chłodnicy pod `CPU_FAN1`, wybierz tryb **PWM** oraz zaznacz **Smart Fan Mode**, aby obroty płynnie rosły wraz z temperaturą procesora (np. 30% obrotów przy temperaturze poniżej 45°C dla absolutnej ciszy).

---

## KROK 2: Instalacja WSL2 i Optymalizacja dla 8 GB RAM & HDD (Obecny PC)

Twój obecny komputer posiada **8 GB pamięci RAM** oraz klasyczny, wolniejszy dysk **HDD**. Domyślnie WSL2 potrafi pobrać nawet do 80% pamięci RAM komputera, co może doprowadzić do zacinania się Windowsa. Musimy to zoptymalizować!

### 1. Instalacja WSL2
Wyszukaj w Windows **PowerShell**, kliknij na niego prawym przyciskiem myszy i wybierz **Uruchom jako administrator**. Następnie wpisz:
```powershell
wsl --install
```
Zrestartuj komputer po zakończeniu instalacji. Przy pierwszym uruchomieniu Ubuntu podaj swoją nazwę użytkownika oraz hasło.

### 2. Optymalizacja pamięci RAM dla WSL2 (Ograniczenie do 3 GB)
Stworzymy plik konfiguracyjny w systemie Windows, aby WSL2 nie zabierał całej pamięci RAM Twojego starego komputera:
1. Wciśnij na klawiaturze skrót **Windows + R**, wpisz `%USERPROFILE%` i naciśnij Enter.
2. Otworzy się Twój folder użytkownika w Windowsie.
3. Utwórz w tym folderze nowy plik tekstowy o nazwie `.wslconfig` (upewnij się, że plik nie ma rozszerzenia `.txt`, pełna nazwa to dokładnie `.wslconfig`).
4. Otwórz ten plik w Notatniku i wklej następującą konfigurację ograniczającą zużycie RAM-u do bezpiecznych 3 GB i procesora do 4 rdzeni:
   ```ini
   [wsl2]
   memory=3GB
   processors=4
   localhostForwarding=true
   ```
5. Zapisz plik. W PowerShellu możesz zrestartować WSL, aby zastosować te zmiany, wpisując:
   ```powershell
   wsl --shutdown
   ```

### 3. Optymalizacja dla dysku HDD (ST2000DM006)
Klasyczne dyski HDD są znacznie wolniejsze od nowoczesnych SSD, zwłaszcza przy operacjach na plikach między Windowsem a Linuksem.
*   **ZŁOTA ZASADA:** Nigdy nie trzymaj kodu projektów deweloperskich w folderach Windowsa (np. `/mnt/c/Users/...` w konsoli Ubuntu).
*   Zamiast tego, zawsze klonuj projekty bezpośrednio do systemu plików WSL (np. do Twojego folderu domowego: `~/projects/`). Daje to nawet **10-krotne przyspieszenie** działania operacji dyskowych na dysku HDD!

---

## KROK 3: Akceleracja GPU Nvidia GTX 1060 / Nowej Karty w WSL2

Karta **NVIDIA GeForce GTX 1060 6GB** to świetna jednostka posiadająca wsparcie dla technologii CUDA!

### 1. Sterowniki
Pobierz i zainstaluj najnowsze oficjalne sterowniki **NVIDIA Game Ready** na system Windows 10. Sterownik Windowsa automatycznie zainstaluje wsparcie CUDA dla podsystemu WSL2. *Nie instaluj sterowników graficznych bezpośrednio w Ubuntu.*

### 2. Instalacja Docker Engine wewnątrz Ubuntu (WSL2)
W konsoli Ubuntu wpisz po kolei:
```bash
# Instalacja wymaganych pakietów systemowych
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Dodanie klucza GPG Dockera
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Skonfigurowanie repozytorium Dockera
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalacja Dockera
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Dodanie uprawnień (zamknij i otwórz ponownie konsolę Ubuntu po tym kroku)
sudo usermod -aG docker $USER
```

### 3. Nvidia Container Toolkit (Obsługa GPU w kontenerach)
Umożliwi to uruchamianie kontenerów wykorzystujących moc obliczeniową karty GTX 1060:
```bash
# Skonfigurowanie repozytorium Nvidia w Ubuntu
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# Instalacja Nvidia Container Toolkit
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# Powiązanie z Dockerem
sudo nvidia-container-toolkit-toolkit-config --target=docker
sudo systemctl restart docker
```

Przetestuj działanie karty graficznej poleceniem:
```bash
docker run --rm --gpus all nvidia/cuda:12.0.0-base-ubuntu22.04 nvidia-smi
```
*Jeśli na ekranie pojawi się tabela informująca o modelu Twojej karty graficznej (GeForce GTX 1060 6GB) oraz jej temperaturze – konfiguracja działa w 100% poprawnie!*

---

## KROK 4: Instalacja Narzędzi Deweloperskich

Zalecamy instalację wszystkich narzędzi deweloperskich bezpośrednio w środowisku **WSL2 (Ubuntu)**, co pozwoli na bezproblemowe uruchamianie skryptów wdrożeniowych.

### 1. Instalacja Terraform w WSL2
```bash
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com/gpg $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install -y terraform
```

### 2. Instalacja AWS CLI w WSL2
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install -y unzip
unzip awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip aws
```

### 3. Instalacja kubectl & Helm
```bash
# Kubectl
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://dl.k8s.io/release/stable.txt
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl

# Helm
curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### 4. Generowanie Kluczy SSH do GitHuba / Copilota
```bash
git config --global user.name "Twoje Imię"
git config --global user.email "twój_email@example.com"

# Generowanie klucza SSH
ssh-keygen -t ed25519 -C "twój_email@example.com"
cat ~/.ssh/id_ed25519.pub
```
*Skopiuj wygenerowany klucz i dodaj go do swojego konta GitHub (Settings -> SSH and GPG keys).*

---

## KROK 5: Uruchomienie Projektu ClusterLaunch

1. **Sklonuj repozytorium bezpośrednio do katalogu domowego w Ubuntu (Optymalizacja HDD):**
   ```bash
   mkdir -p ~/projects
   cd ~/projects
   git clone git@github.com:incantoco/clusterlaunch.git
   cd clusterlaunch
   ```

2. **Skonfiguruj uprawnienia i poświadczenia AWS:**
   ```bash
   aws configure
   ```

3. **Ustal parametry wdrożenia:**
   Ze względu na to, że pracujesz na swoim IP, musisz podać swój publiczny adres IP w formacie CIDR oraz nazwę klucza SSH z AWS EC2:
   ```bash
   export TF_VAR_allowed_cidr="$(curl -s https://ipinfo.io/ip)/32"
   export TF_VAR_key_name="nazwa_twojego_klucza_w_aws"
   ```

4. **Wdróż klaster w wersji lekki (fast):**
   Rekomendujemy wdrożenie w trybie **fast**, co pozwoli zaoszczędzić zasoby w AWS i lokalnie:
   ```bash
   ./deploy.sh fast
   ```

---

## KROK 6: Monitoring Parametrów Sprzętowych w Grafanie

Obie konfiguracje sprzętowe (obecny komputer z GTX 1060 oraz przyszły z chłodzeniem wodnym 360) doskonale nadają się do wizualizacji ich parametrów na pulpitach deweloperskich Grafany.

### 1. Instalacja Windows Exporter (W systemie Windows 10)
`windows_exporter` zbiera w czasie rzeczywistym parametry życiowe Twojego systemu Windows (użycie pamięci, temperatury procesora Intel/AMD, stan dysków HDD/SSD):
1. Pobierz instalator `.msi` z oficjalnego repozytorium: [prometheus-community/windows_exporter/releases](https://github.com/prometheus-community/windows_exporter/releases).
2. Zainstaluj go. Od tej pory usługa uruchomi się w tle i udostępni dane na porcie `9182`.

### 2. Zbieranie metryk z kart NVIDIA GeForce
Aby monitorować temperaturę swojej karty GTX 1060 oraz przyszłej nowej karty graficznej, pobierz i uruchom na Windowsie lekki program: [prometheus-community/nvidia_gpu_exporter](https://github.com/utkuozdemir/nvidia_gpu_exporter), który odpytuje bezpośrednio rdzeń NVML i udostępnia obciążenie, temperaturę rdzenia oraz zużycie pamięci VRAM.

### 3. Wyświetlenie Dashboardu w Grafanie
1. Nawiąż bezpieczny tunel SSH ze swoją instancją w AWS:
   ```bash
   ssh -L 3000:127.0.0.1:3000 ubuntu@<PUBLIC_IP_TWOJEJ_INSTANCJI>
   ```
2. Przekieruj port usługi Grafana na serwerze:
   ```bash
   sudo k3s kubectl -n monitoring port-forward svc/grafana 3000:80 --address 127.0.0.1
   ```
3. Otwórz adres `http://localhost:3000` na Windowsie i zaloguj się danymi (`admin` / hasło z wyjścia Terraform).
4. Dodaj źródło danych (Prometheus) zbierające dane z Twojego komputera domowego na porcie `9182` i zaimportuj gotowy szablon pulpitu Grafany o numerze **14694** lub **10467** (Windows + NVIDIA monitoring).
5. Od teraz możesz cieszyć się w pełni spersonalizowanym panelem monitorującym temperatury procesora Intel/AMD, karty graficznej GTX 1060 oraz parametry pracy chłodzenia wodnego!

---

*Ciesz się uruchomieniem starego komputera i czerp przyjemność z planowania zakupu nowego sprzętu deweloperskiego! Twój projekt jest w 100% przygotowany na każdą z tych platform.*
