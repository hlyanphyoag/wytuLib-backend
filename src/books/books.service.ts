import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddBookAuthorDto, CreateBookDto, DeleteBookAuthorDto, GetBookQueryDto, GetBooksResponseDto, UpdateBookAuthorBodyDto, UpdateBookAuthorParamDto, UpdateBookDto } from './dto/books.dto';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async findAll(query: GetBookQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      category,
      status
    } = query

    const skip = (page - 1) * limit
    const take = Number(limit)

    const where = {
      ...(status && { status }),
      ...(category && {
        OR: [
          { categoryId: category },
          {
            category: {
              name: {
                contains: category,
                mode: 'insensitive'
              }
            }
          }
        ]
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { subtitle: { contains: search, mode: 'insensitive' } },
          {
            authors:
            {
              some:
                { author: { name: { contains: search, mode: 'insensitive' } } }
            }
          },
          { description: { contains: search, mode: 'insensitive' } },
          { edition: { contains: search, mode: 'insensitive' } },
          { isbn: { contains: search, mode: 'insensitive' } }
        ],
      })
    }

    const total = await this.prisma.book.count({ where })

    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    const data = await this.prisma.book.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        authors: {
          select: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    const result = data.map((book: GetBooksResponseDto) => ({
      ...book,
      authors: book.authors.map(author => author.author)
    }))


    return {
      metaData: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage
      },
      result
    }
  }

  async fineOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: {
        id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        authors: {
          select: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!book) {
      throw new NotFoundException('Book not found')
    }

    const authors = [...book.authors.map((a: { author: { id: string, name: string } }) => a.author)]

    return {
      status: HttpStatus.OK,
      ...book,
      authors
    }
  }

  async create(createBookDto: CreateBookDto) {
    const { authorIds, ...bookData } = createBookDto;

    const book = await this.prisma.book.create({
      data: {
        ...bookData,
        ...(authorIds && authorIds.length > 0 && {
          authors: { // Join BookAuthor Table
            create: authorIds.map(authorId => ({
              author: {
                connect: { id: authorId }
              }
            }))
          }
        })
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        authors: {
          select: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })


    return {
      ...book,
      authors: book.authors.map(a => a.author)
    }
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {

    const updatedBook = await this.prisma.book.update({
      where: { id },
      data: {
        ...updateBookDto,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        authors: {
          select: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return {
      ...updatedBook,
      authors: updatedBook.authors.map(a => a.author)
    }
  }

  async deleteBook(id: string) {
    await this.prisma.book.delete({
      where: { id }
    })

    return {
      status: HttpStatus.OK,
      message: 'Book deleted successfully'
    }
  }

  async addNewBookAuthor(bookId: string, addBookAuthorDto: AddBookAuthorDto) {
    const { authorId } = addBookAuthorDto
    const addedNewAuthor = await this.prisma.book.update({
      where: { id: bookId },
      data: {
        authors: {
          create: {
            author: {
              connect: {
                id: authorId
              }
            }
          }
        }
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        authors: {
          select: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return {
      ...addedNewAuthor,
      authors: addedNewAuthor.authors.map(a => a.author)
    }
  }


  async updateBookAuthor(updateBookAuthorParamDto: UpdateBookAuthorParamDto, updateBookAuthorBodyDto: UpdateBookAuthorBodyDto) {
    const { bookId, currentAuthorId } = updateBookAuthorParamDto
    const { newAuthorId } = updateBookAuthorBodyDto
    const updatedAuthor = await this.prisma.book.update({
      where: { id: bookId },
      data: {
        authors: {
          deleteMany: {
            authorId: currentAuthorId
          },
          create: {
            author: {
              connect: {
                id: newAuthorId
              }
            }
          }
        }
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        authors: {
          select: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    return {
      ...updatedAuthor,
      authors: updatedAuthor.authors.map(a => a.author)
    }
  }

  async deleteBookAuthor(deleteBookAuthorDto: DeleteBookAuthorDto) {
    const { bookId, currentAuthorId } = deleteBookAuthorDto
    await this.prisma.book.update({
      where: { id: bookId },
      data: {
        authors: {
          deleteMany: {
            authorId: currentAuthorId
          }
        }
      }
    })

    return {
      status: HttpStatus.OK,
      message: 'Author deleted successfully'
    }
  }
}
