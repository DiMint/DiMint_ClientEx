# DiMint_ClientEx
DiMint Overlord와 DiMint Node의 상태를 확인하고, 간단하게 값을 추가하거나 확인할 수 있는 웹 페이지입니다.
## Installation
1. 먼저 해당 저장소를 git clone을 통해 다운받고, 폴더로 이동합니다.
```bash
$ git clone https://github.com/DiMint/DiMint_ClientEx
$ cd DiMint_ClientEx
```
2. 필요한 패키지를 설치합니다.
```bash
$ pip3 install -r requirements.txt
```
3. config.cfg.example 파일을 config.cfg로 이름을 바꾸거나, 복사합니다.
```bash
$ cp config.cfg.example config.cfg
```
4. config.cfg 파일을 변경합니다. DIMINT\_HOST와 DIMINT\_PORT가 있는데, 띄운 DiMint Overlord의 호스트 주소, 포트를 입력하면 됩니다.

## Execution
1. app.py 파일을 실행합니다.
```bash
$ python app.py
```
2. 이제 웹 브라우저에서 http://localhost:5000 으로 들어가시면 웹 사이트를 볼 수 있습니다.

## Use
1. Monitor 탭에서는 현재 Overlord에 접속해 있는 노드들의 상태를 볼 수 있습니다. 각 노드에 할당된 키의 갯수를 하나의 차트로 보여주고, 각 노드의 시간별 키 갯수/메모리 사용량을 그 아래에 그래프로 보여줍니다.
2. Get/Set 탭에서는 간단하게 특정 key에 있는 값을 가져올 수 있고, 특정 key에 값을 넣을 수도 있습니다. 현재 Increment, Decrement는 작동하지 않습니다.
