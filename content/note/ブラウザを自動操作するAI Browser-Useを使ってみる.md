---
title: ブラウザを自動操作するAI Browser-Useを使ってみる
date: 2025-01-19T17:33:00+09:00
---

https://github.com/browser-use/browser-use

```shell
$ mkdir browser-use
$ uv venv
$ source .venv/bin/activate
$ uv pip install browser-use
$ playwright install
$ vim main.py
```

```python
from langchain_openai import ChatOpenAI
from browser_use import Agent
import asyncio

async def main():
    agent = Agent(
        task="Go to Reddit, search for 'browser-use' in the search bar, click on the first post and return the first comment.",
        llm=ChatOpenAI(model="gpt-4o"),
    )
    result = await agent.run()
    print(result)

asyncio.run(main())

```

```shell
$ python main.py
INFO     [root] Anonymized telemetry enabled. See https://github.com/gregpr07/browser-use for more information.
INFO     [agent] 🚀 Starting task: Go to Reddit, search for 'browser-use' in the search bar, click on the first post and return the first comment.
INFO     [agent]
📍 Step 1
INFO     [agent] 👍 Eval: Success - The task is clear and the page is ready for navigation.
INFO     [agent] 🧠 Memory: Need to navigate to Reddit, search for 'browser-use', click the first post, and extract the first comment.
INFO     [agent] 🎯 Next goal: Open Reddit in a new tab.
INFO     [agent] 🛠️  Action 1/1: {"open_tab":{"url":"https://www.reddit.com"}}
INFO     [controller] 🔗  Opened new tab with https://www.reddit.com
INFO     [agent]
📍 Step 2
INFO     [agent] 👍 Eval: Success - Reddit page loaded and search bar is available.
INFO     [agent] 🧠 Memory: Need to search for 'browser-use' on Reddit.
INFO     [agent] 🎯 Next goal: Enter 'browser-use' into the search bar and perform the search.
INFO     [agent] 🛠️  Action 1/1: {"input_text":{"index":2,"text":"browser-use"}}
INFO     [controller] ⌨️  Input "browser-use" into index 2
INFO     [agent]
📍 Step 3
INFO     [agent] 👍 Eval: Success - 'browser-use' search term entered successfully.
INFO     [agent] 🧠 Memory: Need to perform the search for 'browser-use'.
INFO     [agent] 🎯 Next goal: Click on 'Search for "browser-use"' to perform the search.
INFO     [agent] 🛠️  Action 1/1: {"click_element":{"index":14}}
INFO     [controller] 🖱️  Clicked index 14
INFO     [agent]
📍 Step 4
INFO     [agent] 👍 Eval: Success - Search results are displayed successfully.
INFO     [agent] 🧠 Memory: Need to click the first post related to 'browser-use'.
INFO     [agent] 🎯 Next goal: Click on the first relevant post about 'browser-use'.
INFO     [agent] 🛠️  Action 1/1: {"click_element":{"index":12}}
INFO     [controller] 🖱️  Clicked index 12
INFO     [agent]
📍 Step 5
INFO     [agent] 👍 Eval: Success - Reached the post page successfully.
INFO     [agent] 🧠 Memory: Need to extract the first comment from the post.
INFO     [agent] 🎯 Next goal: Click 'Go to comments' to view the comments section.
INFO     [agent] 🛠️  Action 1/1: {"click_element":{"index":11}}
INFO     [controller] 🖱️  Clicked index 11
INFO     [agent]
📍 Step 6
INFO     [agent] 👍 Eval: Success - Navigated to comments section successfully.
INFO     [agent] 🧠 Memory: Need to extract the first comment.
INFO     [agent] 🎯 Next goal: Extract the text of the first comment.
INFO     [agent] 🛠️  Action 1/1: {"done":{"text":"The first comment is:\n\n\"The readme says it supports Llama 405B but no examples are provided :( It seems a model with multiple images and tool calling is required\""}}
INFO     [agent] 📄 Result: The first comment is:

"The readme says it supports Llama 405B but no examples are provided :( It seems a model with multiple images and tool calling is required"
INFO     [agent] ✅ Task completed successfully
INFO     [agent] Created GIF at agent_history.gif
AgentHistoryList(all_results=[ActionResult(is_done=False, extracted_content='🔗  Opened new tab with https://www.reddit.com', error=None, include_in_memory=True), ActionResult(is_done=False, extracted_content='⌨️  Input "browser-use" into index 2', error=None, include_in_memory=True), ActionResult(is_done=False, extracted_content='🖱️  Clicked index 14', error=None, include_in_memory=True), ActionResult(is_done=False, extracted_content='🖱️  Clicked index 12', error=None, include_in_memory=True), ActionResult(is_done=False, extracted_content='🖱️  Clicked index 11', error=None, include_in_memory=True), ActionResult(is_done=True, extracted_content='The first comment is:\n\n"The readme says it supports Llama 405B but no examples are provided :( It seems a model with multiple images and tool calling is required"', error=None, include_in_memory=False)], all_model_outputs=[{'open_tab': {'url': 'https://www.reddit.com'}}, {'input_text': {'index': 2, 'text': 'browser-use'}}, {'click_element': {'index': 14}}, {'click_element': {'index': 12}}, {'click_element': {'index': 11}}, {'done': {'text': 'The first comment is:\n\n"The readme says it supports Llama 405B but no examples are provided :( It seems a model with multiple images and tool calling is required"'}}])
```

操作は割とゆっくりで、一瞬で情報収集ができるというレベルではないが調べ物だったり、予約だったりを勝手にやってくれるのは省力化にはなるかも。