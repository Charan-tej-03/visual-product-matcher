'''
This module defines a class which will be
used as a table in postgreSQL.
'''

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Text

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    image_filename = Column(String, nullable=False)  # stored in static/images/
    price = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
