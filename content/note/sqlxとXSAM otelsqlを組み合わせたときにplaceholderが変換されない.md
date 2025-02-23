---
title: sqlxとXSAM otelsqlを組み合わせたときにplaceholderが変換されない
date: 2025-01-29T14:52:00+09:00
tags:
  - OpenTelemetry
  - Go
---

otelsqlの導入方法 [[Go sql DBにOpenTelemetryのSpanを追加する]]

PostgreSQLのDBに [sqlx](https://github.com/jmoiron/sqlx) を使って接続している。

```go
import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func NewDB(host, user, password, db, port, sslmode string) (*sqlx.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%v sslmode=%s",
		host, user, password, db, port, sslmode,
	)

	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed connect db: %w", err)
	}
	return db, nil
}

func main() {
    db, err := NewDB("","","","","","")
    // ....

    jason = Person{}
    err = db.Get(&jason, "SELECT * FROM person WHERE first_name=?", "Jason")
    // ....
}
```

このコードに [XSAM/otelsql](https://github.com/XSAM/otelsql) を追加してトレースを取得しようとしたところ、 `internal server error: pq: syntax error at or near \")\"` といったエラーが発生してSQLの実行に失敗するようになった。

```go
import (

	"github.com/XSAM/otelsql"
)


	otelDriverName, err := otelsql.Register("postgres")
	if err != nil {
		return nil, fmt.Errorf("failed to register otelsql driver: %w", err)
	}

	db, err := sqlx.Connect(otelDriverName, dsn)
	if err != nil {
		return nil, fmt.Errorf("failed connect db: %w", err)
	}

```

## 原因

PostgreSQLのplaceholderには `?` は使用できず、`$1`, `$2` を使用する。
本来は `SELECT * FROM person WHERE first_name=?` はエラーになるのだが、sqlxが内部で変換してくれている。
https://github.com/jmoiron/sqlx/blob/41dac167fdad5e3fd81d66cafba0951dc6823a30/bind.go#L60

実際sqlxを外して標準の `database/sql` を使うとエラーになる。

これを知らなかったので、otelsqlを追加したのが悪いのか、だれかが変換してくれていたのか、原因を探すのに手間取った。

## 解決策

デフォルトで、`postgres` driverは `DOLLAR` を使うように指定されている。
https://github.com/jmoiron/sqlx/blob/41dac167fdad5e3fd81d66cafba0951dc6823a30/bind.go#L24-L29

```go
var defaultBinds = map[int][]string{
	DOLLAR:   {"postgres", "pgx", "pq-timeouts", "cloudsqlpostgres", "ql", "nrpostgres", "cockroach"},
	QUESTION: {"mysql", "sqlite3", "nrmysql", "nrsqlite3"},
	NAMED:    {"oci8", "ora", "goracle", "godror"},
	AT:       {"sqlserver", "azuresql"},
}
```

これに合わせて、[sqlx.BindDriver](https://pkg.go.dev/github.com/jmoiron/sqlx#BindDriver) を使ってDriver名を教えてあげればよい。

```diff
	otelDriverName, err := otelsql.Register("postgres")
	if err != nil {
		return nil, fmt.Errorf("failed to register otelsql driver: %w", err)
	}

+	sqlx.BindDriver(otelDriverName, sqlx.DOLLAR)
	db, err := sqlx.Connect(otelDriverName, dsn)
	if err != nil {
		return nil, fmt.Errorf("failed connect db: %w", err)
	}

```

これでSQL文は変えずに今まで通り実行できるようになった。
