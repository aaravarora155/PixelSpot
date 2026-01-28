CREATE TABLE products(
    id INT NOT NULL,
    name STRING,
    price MONEY,
    PRIMARY KEY (id)
);

INSERT INTO products
VALUES (1,"Pen",1.20,32);

INSERT INTO products
VALUES (1, "Pencil",0.80,12);

SELECT * FROM products
WHERE name="Pen";

SELECT * FROM products
WHERE price=1.4;

UPDATE products
SET price=1.4
WHERE price=1.2;

ALTER TABLE products
ADD quantity INT;

UPDATE products
SET quantity=30
WHERE quantity IS NULL;

DELETE FROM products
WHERE quantity=30;