# @prequest/graphql

A Syntax Sugar For Post Http Request Based On PreQuest.

## Introduction

This is a part of PreQuest library which meaning you can't do anything with this single.

## Install

```bash
npm install @prequest/graphql
```

## Usage

```ts
import { createPreQuest } from '@prequest/core'
import { graphql } from '@prequest/graphql'

const request = graphql(createPreQuest(adapter, { path: '/graphql' }))

const query = `
  {
    me {
      name
    }
  }
`

const variables = { name: 'prequest' }

const opt = { path: '/graphql' }

request(query, variables, opt).then(res => console.log(res))
```
