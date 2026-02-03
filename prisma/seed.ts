import { PrismaClient, UserRole, BookStatus, BorrowStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt';

import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config()

const prisma = new PrismaClient({ "accelerateUrl": process.env.DATABASE_URL })

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.fine.deleteMany();
    await prisma.review.deleteMany();
    await prisma.borrow.deleteMany();
    await prisma.bookView.deleteMany();
    await prisma.trendingBook.deleteMany();
    await prisma.bookAuthor.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.user.deleteMany();

    // Hash passwords
    const hashedAdminPassword = await bcrypt.hash('wytuadmin', 10);
    const hashedAlicePassword = await bcrypt.hash('alice123', 10);

    // Create Users
    console.log('👥 Creating users...');
    const adminUser = await prisma.user.create({
        data: {
            email: 'wytuAdmin@gmail.com',
            password: hashedAdminPassword,
            firstName: 'Wytu',
            lastName: 'Admin',
            role: UserRole.ADMIN,
            phone: '+95-9-123456789',
            address: 'Yangon, Myanmar',
            dateOfBirth: new Date('1990-01-15'),
            isActive: true,
        },
    });

    const aliceUser = await prisma.user.create({
        data: {
            email: 'alice@example.com',
            password: hashedAlicePassword,
            firstName: 'Alice',
            lastName: 'Johnson',
            role: UserRole.STUDENT,
            studentId: 'STU2024001',
            phone: '+95-9-987654321',
            address: 'Mandalay, Myanmar',
            dateOfBirth: new Date('2002-05-20'),
            isActive: true,
        },
    });

    const bobUser = await prisma.user.create({
        data: {
            email: 'bob@example.com',
            password: await bcrypt.hash('bob123', 10),
            firstName: 'Bob',
            lastName: 'Smith',
            role: UserRole.STUDENT,
            studentId: 'STU2024002',
            phone: '+95-9-555123456',
            address: 'Naypyidaw, Myanmar',
            dateOfBirth: new Date('2001-08-10'),
            isActive: true,
        },
    });

    console.log('✅ Created 3 users');

    // Create Categories
    console.log('📚 Creating categories...');
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Fiction',
                description: 'Fictional novels and stories',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Science',
                description: 'Scientific books and research',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Technology',
                description: 'Programming, IT, and technology books',
            },
        }),
        prisma.category.create({
            data: {
                name: 'History',
                description: 'Historical books and biographies',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Self-Help',
                description: 'Personal development and motivation',
            },
        }),
    ]);

    console.log('✅ Created 5 categories');

    // Create Authors
    console.log('✍️  Creating authors...');
    const authors = await Promise.all([
        prisma.author.create({
            data: {
                name: 'J.K. Rowling',
                biography: 'British author, best known for the Harry Potter series',
            },
        }),
        prisma.author.create({
            data: {
                name: 'Robert C. Martin',
                biography: 'Software engineer and author, known as Uncle Bob',
            },
        }),
        prisma.author.create({
            data: {
                name: 'Stephen Hawking',
                biography: 'Theoretical physicist and cosmologist',
            },
        }),
        prisma.author.create({
            data: {
                name: 'Dale Carnegie',
                biography: 'American writer and lecturer on self-improvement',
            },
        }),
        prisma.author.create({
            data: {
                name: 'George Orwell',
                biography: 'English novelist and essayist',
            },
        }),
        prisma.author.create({
            data: {
                name: 'Yuval Noah Harari',
                biography: 'Israeli historian and professor',
            },
        }),
    ]);

    console.log('✅ Created 6 authors');

    // Create Books
    console.log('📖 Creating books...');
    const book1 = await prisma.book.create({
        data: {
            isbn: '978-0-545-01022-1',
            title: 'Harry Potter and the Deathly Hallows',
            subtitle: 'Book 7',
            description: 'The final book in the Harry Potter series',
            edition: '1st Edition',
            pages: 607,
            coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
            totalCopies: 5,
            availableCopies: 3,
            status: BookStatus.AVAILABLE,
            viewCount: 120,
            borrowCount: 45,
            categoryId: categories[0].id, // Fiction
        },
    });

    const book2 = await prisma.book.create({
        data: {
            isbn: '978-0-13-235088-4',
            title: 'Clean Code',
            subtitle: 'A Handbook of Agile Software Craftsmanship',
            description: 'Best practices for writing clean, maintainable code',
            edition: '1st Edition',
            pages: 464,
            coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
            totalCopies: 10,
            availableCopies: 7,
            status: BookStatus.AVAILABLE,
            viewCount: 250,
            borrowCount: 89,
            categoryId: categories[2].id, // Technology
        },
    });

    const book3 = await prisma.book.create({
        data: {
            isbn: '978-0-553-10953-5',
            title: 'A Brief History of Time',
            subtitle: 'From the Big Bang to Black Holes',
            description: 'A landmark volume in science writing',
            edition: '10th Anniversary Edition',
            pages: 256,
            coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
            totalCopies: 3,
            availableCopies: 2,
            status: BookStatus.AVAILABLE,
            viewCount: 180,
            borrowCount: 67,
            categoryId: categories[1].id, // Science
        },
    });

    const book4 = await prisma.book.create({
        data: {
            isbn: '978-0-671-02730-3',
            title: 'How to Win Friends and Influence People',
            description: 'Timeless advice on building relationships',
            edition: 'Revised Edition',
            pages: 288,
            coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
            totalCopies: 4,
            availableCopies: 4,
            status: BookStatus.AVAILABLE,
            viewCount: 95,
            borrowCount: 34,
            categoryId: categories[4].id, // Self-Help
        },
    });

    const book5 = await prisma.book.create({
        data: {
            isbn: '978-0-452-28423-4',
            title: '1984',
            description: 'Dystopian social science fiction novel',
            edition: 'Centennial Edition',
            pages: 328,
            coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
            totalCopies: 6,
            availableCopies: 4,
            status: BookStatus.AVAILABLE,
            viewCount: 310,
            borrowCount: 102,
            categoryId: categories[0].id, // Fiction
        },
    });

    const book6 = await prisma.book.create({
        data: {
            isbn: '978-0-062-31609-6',
            title: 'Sapiens',
            subtitle: 'A Brief History of Humankind',
            description: 'Explores the history of the human species',
            edition: '1st Edition',
            pages: 443,
            coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
            totalCopies: 5,
            availableCopies: 3,
            status: BookStatus.AVAILABLE,
            viewCount: 275,
            borrowCount: 78,
            categoryId: categories[3].id, // History
        },
    });

    console.log('✅ Created 6 books');

    // Link Books to Authors
    console.log('🔗 Linking books to authors...');
    await Promise.all([
        prisma.bookAuthor.create({
            data: { bookId: book1.id, authorId: authors[0].id },
        }),
        prisma.bookAuthor.create({
            data: { bookId: book2.id, authorId: authors[1].id },
        }),
        prisma.bookAuthor.create({
            data: { bookId: book3.id, authorId: authors[2].id },
        }),
        prisma.bookAuthor.create({
            data: { bookId: book4.id, authorId: authors[3].id },
        }),
        prisma.bookAuthor.create({
            data: { bookId: book5.id, authorId: authors[4].id },
        }),
        prisma.bookAuthor.create({
            data: { bookId: book6.id, authorId: authors[5].id },
        }),
    ]);

    console.log('✅ Linked books to authors');

    // Create Borrows
    console.log('📤 Creating borrow records...');
    const borrow1 = await prisma.borrow.create({
        data: {
            userId: aliceUser.id,
            bookId: book1.id,
            borrowDate: new Date('2024-12-01'),
            dueDate: new Date('2024-12-15'),
            returnDate: new Date('2024-12-14'),
            status: BorrowStatus.RETURNED,
            renewalCount: 0,
            notes: 'Returned in good condition',
        },
    });

    const borrow2 = await prisma.borrow.create({
        data: {
            userId: aliceUser.id,
            bookId: book2.id,
            borrowDate: new Date('2024-12-20'),
            dueDate: new Date('2025-01-03'),
            status: BorrowStatus.ACTIVE,
            renewalCount: 0,
            notes: 'Student requested programming book',
        },
    });

    const borrow3 = await prisma.borrow.create({
        data: {
            userId: bobUser.id,
            bookId: book5.id,
            borrowDate: new Date('2024-12-10'),
            dueDate: new Date('2024-12-24'),
            status: BorrowStatus.OVERDUE,
            renewalCount: 1,
            notes: 'Book is overdue, fine applied',
        },
    });

    const borrow4 = await prisma.borrow.create({
        data: {
            userId: bobUser.id,
            bookId: book6.id,
            borrowDate: new Date('2024-12-22'),
            dueDate: new Date('2025-01-05'),
            status: BorrowStatus.ACTIVE,
            renewalCount: 0,
        },
    });

    console.log('✅ Created 4 borrow records');

    // Create Reviews
    console.log('⭐ Creating reviews...');
    await Promise.all([
        prisma.review.create({
            data: {
                userId: aliceUser.id,
                bookId: book1.id,
                rating: 5,
                comment: 'Amazing conclusion to the series! Couldn\'t put it down.',
            },
        }),
        prisma.review.create({
            data: {
                userId: aliceUser.id,
                bookId: book2.id,
                rating: 5,
                comment: 'Essential reading for any programmer. Changed how I write code.',
            },
        }),
        prisma.review.create({
            data: {
                userId: bobUser.id,
                bookId: book5.id,
                rating: 4,
                comment: 'Thought-provoking and eerily relevant to today\'s world.',
            },
        }),
        prisma.review.create({
            data: {
                userId: bobUser.id,
                bookId: book3.id,
                rating: 4,
                comment: 'Complex but fascinating. Hawking explains difficult concepts well.',
            },
        }),
    ]);

    console.log('✅ Created 4 reviews');

    // Create Fines
    console.log('💰 Creating fines...');
    await Promise.all([
        prisma.fine.create({
            data: {
                userId: bobUser.id,
                borrowId: borrow3.id,
                amount: 5000, // 5000 MMK
                reason: 'Late return - 4 days overdue',
                isPaid: false,
                issuedById: adminUser.id,
            },
        }),
    ]);

    console.log('✅ Created 1 fine');

    // Create Book Views
    console.log('👁️  Creating book views...');
    await Promise.all([
        prisma.bookView.create({
            data: {
                bookId: book1.id,
                userId: aliceUser.id,
                ipAddress: '192.168.1.100',
                userAgent: 'Mozilla/5.0',
            },
        }),
        prisma.bookView.create({
            data: {
                bookId: book2.id,
                userId: aliceUser.id,
                ipAddress: '192.168.1.100',
                userAgent: 'Mozilla/5.0',
            },
        }),
        prisma.bookView.create({
            data: {
                bookId: book5.id,
                userId: bobUser.id,
                ipAddress: '192.168.1.101',
                userAgent: 'Chrome/120.0',
            },
        }),
    ]);

    console.log('✅ Created 3 book views');

    // Create Activity Logs
    console.log('📝 Creating activity logs...');
    await Promise.all([
        prisma.activityLog.create({
            data: {
                action: 'ISSUE_BOOK',
                description: 'Issued "Clean Code" to Alice Johnson',
                userId: aliceUser.id,
                librarianId: adminUser.id,
                createdAt: new Date('2024-12-20'),
            },
        }),
        prisma.activityLog.create({
            data: {
                action: 'RETURN_BOOK',
                description: 'Returned "Harry Potter and the Deathly Hallows" from Alice Johnson',
                userId: aliceUser.id,
                librarianId: adminUser.id,
                createdAt: new Date('2024-12-14'),
            },
        }),
        prisma.activityLog.create({
            data: {
                action: 'ADD_FINE',
                description: 'Added fine for late return of "1984" to Bob Smith',
                userId: bobUser.id,
                librarianId: adminUser.id,
                createdAt: new Date('2024-12-25'),
            },
        }),
    ]);

    console.log('✅ Created 3 activity logs');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  - Users: 3 (1 admin, 2 students)');
    console.log('  - Categories: 5');
    console.log('  - Authors: 6');
    console.log('  - Books: 6');
    console.log('  - Borrows: 4 (1 returned, 2 active, 1 overdue)');
    console.log('  - Reviews: 4');
    console.log('  - Fines: 1');
    console.log('  - Book Views: 3');
    console.log('  - Activity Logs: 3');
    console.log('\n👤 Login Credentials:');
    console.log('  Admin:');
    console.log('    Email: wytuAdmin@gmail.com');
    console.log('    Password: wytuadmin');
    console.log('  Student (Alice):');
    console.log('    Email: alice@example.com');
    console.log('    Password: alice123');
    console.log('  Student (Bob):');
    console.log('    Email: bob@example.com');
    console.log('    Password: bob123');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
